# Database Setup Required

## Error: 500 Internal Server Error on Progress API

If you're getting a 500 error when checking questions, it means the `user_progress` table doesn't exist in your Supabase database yet.

## Quick Fix

### 1. Go to Supabase SQL Editor

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Create a new query

### 2. Run This SQL Script

```sql
-- User Progress Table
CREATE TABLE IF NOT EXISTS user_progress (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    question_slug TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT false,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Ensure unique combination of user and question
    UNIQUE(user_id, question_slug)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_question_slug ON user_progress(question_slug);
CREATE INDEX IF NOT EXISTS idx_user_progress_completed ON user_progress(completed);

-- Enable Row Level Security
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only access their own progress
CREATE POLICY "Users can view their own progress" ON user_progress
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own progress" ON user_progress
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own progress" ON user_progress
    FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own progress" ON user_progress
    FOR DELETE USING (auth.uid()::text = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_progress_updated_at
    BEFORE UPDATE ON user_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### 3. Verify Setup

After running the SQL, test by checking a question. The error should be gone and progress should save to the database.

### 4. Verify Table Creation

You can verify the table was created by running:

```sql
SELECT * FROM user_progress LIMIT 1;
```

## What This Enables

- ✅ Cross-device progress sync
- ✅ Persistent progress storage
- ✅ Secure user data isolation
- ✅ Automatic timestamps

Once this is set up, when you check a question, it will be saved to the database and synced across all your devices!

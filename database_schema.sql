CREATE TABLE IF NOT EXISTS user_progress (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    question_slug TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT false,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, question_slug)
);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_question_slug ON user_progress(question_slug);
CREATE INDEX IF NOT EXISTS idx_user_progress_completed ON user_progress(completed);
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own progress" ON user_progress
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own progress" ON user_progress
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own progress" ON user_progress
    FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own progress" ON user_progress
    FOR DELETE USING (auth.uid()::text = user_id);
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';
CREATE TRIGGER update_user_progress_updated_at 
    BEFORE UPDATE ON user_progress 
    EXECUTE FUNCTION update_updated_at_column();
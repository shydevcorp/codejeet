import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { VideoDialog } from "./VideoDialog";

interface Question {
  id: string;
  title: string;
  url: string;
  isPremium: boolean;
  acceptance: string;
  difficulty: string;
  frequency: string;
}

export function QuestionsTable({ questions }: { questions: Question[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Difficulty</TableHead>
          <TableHead>Acceptance</TableHead>
          <TableHead>Video</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {questions.map((question) => (
          <TableRow key={question.id}>
            <TableCell>{question.id}</TableCell>
            <TableCell>{question.title}</TableCell>
            <TableCell>{question.difficulty}</TableCell>
            <TableCell>{question.acceptance}</TableCell>
            <TableCell>
              <VideoDialog id={question.id} title={question.title} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

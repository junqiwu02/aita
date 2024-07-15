import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import StartOptions from "../components/start-options";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Create() {
  return (
    <>
      <Card className="relative">
        <Link
          href="/app"
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <ArrowRight className="h-4 w-4"></ArrowRight>
        </Link>

        <CardHeader>
          Create Video 🖌️
          <CardDescription>Choose an option to get started!</CardDescription>
        </CardHeader>

        <CardContent className="flex h-[65vh] align-middle">
          <StartOptions></StartOptions>
        </CardContent>

        <CardFooter></CardFooter>
      </Card>
    </>
  );
}

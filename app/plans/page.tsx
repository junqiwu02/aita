import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { CheckCircle, Crown } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

const PlanCard = ({
  title,
  pro,
  price,
  period,
  features,
  active,
  action,
}: {
  title: string;
  pro?: boolean;
  price: number;
  period: string;
  features: string[];
  active?: boolean;
  action: ReactNode;
}) => {
  return (
    <Card className={`flex flex-1 flex-col ${active && "shadow-inner"}`}>
      <CardHeader>
        <h1 className="flex text-lg">
          {pro && (
            <>
              <Crown className="my-auto h-4 w-4 text-yellow-500"></Crown>&nbsp;
            </>
          )}
          {title}
        </h1>
        <div className="flex pt-4">
          <h2 className="text-2xl font-bold text-primary">${price}</h2>
          <span className="mb-1 mt-auto text-sm text-muted-foreground">
            /{period}
          </span>
        </div>
      </CardHeader>
      <CardContent className="mb-10">
        <ul className="space-y-3 text-sm">
          {features.map((text, idx) => (
            <li className="flex" key={idx}>
              <CheckCircle className="my-auto h-3 w-3 text-muted-foreground"></CheckCircle>
              &nbsp;
              {text}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="mb-0 mt-auto">{action}</CardFooter>
    </Card>
  );
};

export default async function Pricing() {
  const session = await auth();
  const signedIn = session !== null;

  return (
    <>
      <div className="mt-[64px] flex w-[100%] flex-col gap-4 p-4 md:flex-row">
        <PlanCard
          title="Guest"
          price={0}
          period="forever"
          features={["2 generations per day"]}
          action={
            <p className="text-xs text-muted-foreground">No sign in required</p>
          }
          active={!signedIn}
        ></PlanCard>
        <PlanCard
          title="Free"
          price={0}
          period="forever"
          features={["5 generations per day", "ElevenLabs voices*"]}
          action={
            signedIn ? (
              <Button disabled>Active</Button>
            ) : (
              <Button asChild>
                <Link href="/signin">Get Started</Link>
              </Button>
            )
          }
          active={signedIn}
        ></PlanCard>
        <PlanCard
          title="Pro"
          price={10}
          period="month"
          features={[
            "20 generations per day",
            "ElevenLabs voices*",
            "No watermark",
          ]}
          action={<Button disabled>Coming Soon</Button>}
          pro
        ></PlanCard>
      </div>
      <p className="m-6 text-center text-xs text-muted-foreground">
        *Your own API key is required for ElevenLabs voices in all plans.
      </p>
    </>
  );
}

import Link from "next/link";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from ".././components/ui/card"
import { Button } from "../components/ui/button";
export default function Home() {
  return (
    <>
      <div className="flex items-center justify-center h-screen p-5">
        <Card className="w-full sm:max-w-[50%] shadow-xl border-2 rounded-2xl">
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl font-semibold text-center">
              E-commerce web app
            </CardTitle>
            <CardDescription className="text-gray-500 text-center">
              Powerful website to grow your business
            </CardDescription>
            <hr className="border-t" />
          </CardHeader>

          <CardContent className="flex justify-center">
            <Button>
              <Link href="/vendor" className="inline-block font-bold transition">
                Go to Dashboard
              </Link>
            </Button>
            Link: {process.env.NEXT_PUBLIC_API_URL}
          </CardContent>

          <CardFooter className="flex items-center justify-center mb-5 text-sm text-gray-400">
            &copy; 2025 Ecommerce Inc. All rights reserved.
          </CardFooter>
        </Card>

      </div>

    </>
  );
}

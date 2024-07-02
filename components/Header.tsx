import AuthButton from "./AuthButton";
import { createClient } from "@/utils/supabase/server";
import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { Button } from "./ui/button";
import { SupabaseClient } from "@supabase/supabase-js";
import { CreateDeckForm } from "./CreateDeckForm";
import Link from "next/link";

export default async function Header() {
  const supabase = createClient();
  // const canInitSupabaseClient = () => {
  //   // This function is just for the interactive tutorial.
  //   // Feel free to remove it once you have Supabase connected.
  //   try {
  //     createClient();
  //     return true;
  //   } catch (e) {
  //     return false;
  //   }
  // };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let isSupabaseConnected: boolean = false;
  let hidden: string = "hidden";
  if (user) {
    isSupabaseConnected = true;
    hidden = "";
  }
  const components: { title: string; href: string; }[] = [
    {
      title: "New Deck",
      href: "/createdeck",
    },
    {
      title: "New Bookmark",
      href: "/createbookmark",
    },
  ]
  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
          <div className={hidden}>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Components</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                      {components.map((component) => (
                        <Button asChild>
                          <Link href={component.href}>{component.title}</Link>
                        </Button>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          {<AuthButton />}
        </div>
      </nav>
    </div>
  );
}

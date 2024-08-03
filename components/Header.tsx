import AuthButton from './AuthButton';
import { createClient } from '@/utils/supabase/server';
import React from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuViewport,
} from '@/components/ui/navigation-menu';
import { Button } from './ui/button';
import { SupabaseClient } from '@supabase/supabase-js';
import Link from 'next/link';

export default async function Header() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let isSupabaseConnected: boolean = false;
  let hidden: string = 'hidden';
  if (user) {
    isSupabaseConnected = true;
    hidden = '';
  }
  const explores: { title: string; href: string }[] = [
    {
      title: 'Find Deck',
      href: '/decks/public',
    },
  ];
  const creations: { title: string; href: string }[] = [
    {
      title: 'New Deck',
      href: '/createdeck',
    },
    {
      title: 'New Bookmark',
      href: '/createbookmark',
    },
  ];
  const yourStuffs: { title: string; href: string }[] = [
    {
      title: 'Your Decks',
      href: '/yourdecks',
    },
    {
      title: 'Your Bookmarks',
      href: '/yourbookmarks',
    },
  ];
  return (
    <div className="mx-auto mb-2 flex max-w-lg flex-1 flex-col items-center gap-20">
      <nav className="flex h-16 w-full justify-center border-b border-b-foreground/10">
        <div className="flex w-full max-w-4xl items-center justify-between p-3 text-sm">
          <div className={hidden}>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Home
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Explore</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {explores.map((explore) => (
                        <Button asChild>
                          <Link href={explore.href}>{explore.title}</Link>
                        </Button>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Your Stuff</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {yourStuffs.map((yourStuff) => (
                        <Button asChild>
                          <Link href={yourStuff.href}>{yourStuff.title}</Link>
                        </Button>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Create</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {creations.map((creation) => (
                        <Button asChild>
                          <Link href={creation.href}>{creation.title}</Link>
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

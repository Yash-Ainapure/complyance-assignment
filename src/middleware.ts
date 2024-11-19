import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const isOnboardingRoute = createRouteMatcher(["/onboarding"]);
const isPublicRoute = createRouteMatcher([
  "/",
  "/api/getData",
  "/api/createUser",
  "/api/getUserInfo",
  "/api/createData",
  "/api/getCountryData",
  "/api/updateData",
  "/api/getUserById",
  "/api/updateAssignedCountry",
  "/api/deleteData",
]);
const isApiRoute = createRouteMatcher(["/api/createUser"]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  console.log("Running middleware...");
  const { userId, sessionClaims, redirectToSignIn } = await auth();

  // Bypass API routes directly to avoid interference
  if (isApiRoute(req)) {
    console.log("Bypassing middleware for API route");
    return NextResponse.next();
  }

  // For users visiting /onboarding, don't try to redirect
  if (userId && isOnboardingRoute(req)) {
    console.log("User is on onboarding route");
    return NextResponse.next();
  }

  // If the user isn't signed in and the route is private, redirect to sign-in
  if (!userId && !isPublicRoute(req)) {
    console.log("User is not signed in, redirecting...");
    return redirectToSignIn({ returnBackUrl: req.url });
  } else {
    console.log("User is signed in");
  }

  // Catch users who do not have `onboardingComplete: true` in their publicMetadata
  // Redirect them to the /onboading route to complete onboarding
  if (userId && !sessionClaims?.metadata?.onboardingComplete) {
    console.log("User has not completed onboarding, redirecting...");
    const onboardingUrl = new URL("/onboarding", req.url);
    return NextResponse.redirect(onboardingUrl);
  } else {
    console.log("User has completed onboarding");
  }

  // If the user is logged in and the route is protected, let them view.
  if (userId && !isPublicRoute(req)) return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

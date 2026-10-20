import { NextResponse } from "next/server";

// Demo mode: writes disabled — see the note in ../route.ts
export async function PATCH() {
  return NextResponse.json(
    {
      error:
        "Demo mode: writes to the shared gallery are disabled. Changes are saved to your browser only.",
    },
    { status: 403 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    {
      error:
        "Demo mode: writes to the shared gallery are disabled. Changes are saved to your browser only.",
    },
    { status: 403 }
  );
}

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // defaults to auto
export async function GET( request: Request ) {
    const query   = new URL( request.url ).searchParams;
    const name    = query.get( 'name' ) || 'World';
    const message = `Hello, ${ name }!`;
    return NextResponse.json( { message } );
}

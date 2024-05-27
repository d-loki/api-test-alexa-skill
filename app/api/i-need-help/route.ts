import { WebClient } from '@slack/web-api';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET( request: Request ) {
    const query = new URL( request.url ).searchParams;

    const fromUser = query.get( 'from' ) || null;
    const toUser   = query.get( 'to' ) || null;

    const token   = process.env.SLACK_TOKEN;
    const channel = process.env.SLACK_SEND_TO;

    if ( !token || !channel ) {
        return NextResponse.json( { status: 'KO', error: 'Missing Slack token or channel' }, { status: 500 } );
    }

    const web = new WebClient( token );


    let prefix = `${ fromUser } demande de l'aide`;
    if ( !fromUser ) {
        prefix = 'Une personne dont vous avez la charge demande de l\'aide ';
    }
    const message = toUser ? `${ prefix } à ${ toUser } via Alexa !` : `${ prefix } via Alexa !`;

    await web.chat.postMessage( { text: message, channel } );
    return NextResponse.json( { status: 'OK' } );


}

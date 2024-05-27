import { WebClient } from '@slack/web-api';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // defaults to auto
export async function GET( request: Request ) {
    const query = new URL( request.url ).searchParams;

    const toUser   = query.get( 'to' ) || null;
    const fromUser = query.get( 'from' ) || null;

    const token = process.env.SLACK_TOKEN;
    const web   = new WebClient( token );

    const users = await web.users.list( {
                                            limit: 100,
                                        } );

    let userId;
    let conversationId;

    if ( users.members ) {
        const user = users.members.find( user => user.name === process.env.SLACK_SEND_TO );
        if ( user ) {
            userId = user.id;
        }
    }

    if ( userId ) {
        const conversations = await web.conversations.list( { types: 'im' } );
        if ( conversations.channels ) {
            const conversation = conversations.channels.find( conversation => conversation.user === userId );
            if ( conversation ) {
                conversationId = conversation.id;
            }
        }
    }


    if ( conversationId ) {
        let prefix = `${ fromUser } demande de l'aide `;
        if ( !fromUser ) {
            prefix = 'Une personne dont vous avez la charge demande de l\'aide ';
        }
        const message = toUser ? `${ prefix } à ${ toUser } via Alexa !` : `${ prefix } via Alexa !`;

        await web.chat.postMessage( { text: message, channel: conversationId } );
        return NextResponse.json( { status: 'OK' } );
    }


    return NextResponse.json( { status: 'KO' } );
}

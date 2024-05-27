import { WebClient } from '@slack/web-api';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // defaults to auto
export async function GET( request: Request ) {
    const query  = new URL( request.url ).searchParams;
    const toUser = query.get( 'to' ) || null;
    const fromUser = query.get( 'from' ) || 'xxx';

    const token = process.env.SLACK_TOKEN;
    const web   = new WebClient( token );

    let userId: string | null         = null;
    let conversationId: string | null = null;
    const users                       = await web.users.list( {
                                                                  limit: 100,
                                                              } );
    if ( users.members ) {
        for ( const user of users.members ) {
            if ( user.name === process.env.SLACK_SEND_TO ) {
                userId = user.id ?? null;
                break;
            }
        }
    }

    const conversations = await web.conversations.list( {
                                                            types: 'im',
                                                        } );

    if ( conversations.channels ) {
        for ( const conversation of conversations.channels ) {
            if ( conversation.user === userId ) {
                conversationId = conversation.id ?? null;
                break;
            }
        }
    }

    if ( conversationId !== null ) {
        await ( async () => {


            let message = `${ fromUser } a besoin d'aide !`;
            if ( toUser !== null && toUser !== undefined && toUser !== '' ) {
                message = `${ fromUser } demande de l'aide à ${ toUser } via Alexa !`;
            }

            const result = await web.chat.postMessage( {
                                                           text: message,
                                                           channel: conversationId,
                                                       } );
        } )();

        return NextResponse.json( { status: 'OK' } );
    }

    return NextResponse.json( { status: 'KO' } );
}

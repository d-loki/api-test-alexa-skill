import { WebClient } from '@slack/web-api';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // defaults to auto
export async function GET( request: Request ) {
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

            const result = await web.chat.postMessage( {
                                                           text:    'Je suis un message envoyé par Alexa !',
                                                           channel: conversationId,
                                                       } );
        } )();
    }

    return NextResponse.json( { status: 'OK' } );
}

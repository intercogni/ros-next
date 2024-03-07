/**
* ╭╴RosSubscription
* ╰--> A ROS Component used to Subscribe to a ROS Topic via Websocket
* ╭╴Oportunitas (Taib Izzat Samawi); 16/Nov/2023
* ╰--> @intercogni-ros-react | @Barunastra_ITS | @Intercogni
**/

import { RosLib, useRememberedRos } from '../common/components';
import { Fragment, useEffect } from 'react';

export default function RosSubscription({
    topic,
    msg_type,
    msg_spinner,
    children,
    style,
}: {
    topic: string,
    msg_type: string,
    msg_spinner: any,
    style?: any,
    children: React.ReactNode,
}
) {
    // Remember the ROS mentioned in the wrapper of this element
    const RosInstance = useRememberedRos();
    
    useEffect(() => {
        const Topic = new RosLib.Topic({
            ros         : RosInstance,
            name        : `${topic}`,
            messageType : `${msg_type}`
        });

        Topic.subscribe(function(received_msg: any) {
            msg_spinner(received_msg);
        })

        return (function() {
            Topic.unsubscribe();
        });
    })

    // Return all the children of this element
    return <Fragment />
}

//const RosInstance = rememberRos();
//
//    useEffect(() => {
//        // Create a ROS topic to link with
//        const Topic = new RosLib.Topic(
//            { ros: RosInstance, name: {topic}, messageType : {msg_type} }
//        );
//
//        // Subscribe to the topic and set <msg> to be the steamed data
//        Topic.subscribe(function(received_msg: any) { 
//            console.log(received_msg);
//        });
//
//        // Unsubscribe to the topic after data is obtained
//        return (function() { Topic.unsubscribe(); });
//    }, []);
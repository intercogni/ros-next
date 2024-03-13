/**
 * RosSubscriberNode
 * ╰--> A ROS Component used to Subscribe to a ROS Topic via Websocket
 * ╭╴Oportunitas (Taib Izzat Samawi); 16/Nov/2023
 * ╰--> @intercogni-ros-react | @Barunastra_ITS | @Intercogni
 **/

import { RosLib, useRememberedRos } from '../common/components'
import { Fragment, useEffect } from 'react'

export default function RosSubscriberNode({
    topic,
    msg_type,
    callback,
    rate,
    children,
    style
}: {
    topic     : string
    msg_type  : string
    callback  : any
    rate     ?: any
    style    ?: any
    children ?: React.ReactNode
}) {
    // Remember the ROS mentioned in the wrapper of this element
    const RosInstance = useRememberedRos()
    
    useEffect(() => {
        const Topic = new RosLib.Topic({
            ros         : RosInstance,
            name        : `${topic}`,
            messageType : `${msg_type}`
        })
        console.log("Initiated topic to subscribe")

        Topic.subscribe(function (received_msg: any) {
            callback(received_msg)
        })
        console.log("Subscribed to topic")

        if (rate !== undefined) {
            setTimeout(() => {}, (1000 / rate))
        }
    }, [RosInstance])

    // Return all the children of this element
    return <Fragment />
}
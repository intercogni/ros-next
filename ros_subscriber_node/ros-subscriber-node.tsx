/**
 * RosSubscriberNode
 * ╰--> A ROS Component used to Subscribe to a ROS Topic via Websocket
 * ╭╴Oportunitas (Taib Izzat Samawi); 16/Nov/2023
 * ╰--> @ros_react | @oportunitas | @intercogni
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
        const period = (rate === undefined) ? (1) : Math.round(1000 / rate)
        console.log(rate)
        console.log(period)

        const Topic = new RosLib.Topic({
            ros           : RosInstance,
            name          : `${topic}`,
            messageType   : `${msg_type}`,
            throttle_rate : period
        })
        Topic.subscribe((received_msg: any) => { callback(received_msg) })
        
        return (() => {
            Topic.unsubscribe()
        })
    }, [RosInstance, rate])

    // Return all the children of this element
    return <Fragment />
}
/**
 * ╭╴RosClientNode
 * ╰--> A Special Div Element that functions as a ROS2 Service Client Node
 * ╭╴Oportunitas (Taib Izzat Samawi); 21/Nov/2023
 * ╰--> @ros_react | @oportunitas | @intercogni
 **/

import { RosLib, useRememberedRos } from '../common/components'
import { Fragment, useEffect } from 'react'

export default function RosClientNode({
    service_name,
    service_type,
    trigger,
    request_msg,
    callback,
    errorHandler
}: {
    service_name  : any
    service_type  : any
    trigger       : any
    request_msg   : any
    callback      : any
    errorHandler ?: any
}) {
    // Remember the ROS mentioned in the wrapper of this element
    const RosInstance = useRememberedRos()

    // Call the service every time the trigger variable changes value
    useEffect(() => {
        const client = new RosLib.Service({
            ros         : RosInstance,
            name        : service_name,
            serviceType : service_type
        })
        const srv_request = new RosLib.ServiceRequest(request_msg)

        console.log(`calling service: ${service_name}`)
        client.callService(srv_request, callback, errorHandler)
    }, [trigger])

    // Return all the children of this element
    return <Fragment />
}
/**
 * ╭╴RosServiceClient
 * ╰--> A Special Div Element that functions as a ROS2 Service Client
 * ╭╴Oportunitas (Taib Izzat Samawi); 21/Nov/2023
 * ╰--> @intercogni-ros-react | @Barunastra_ITS | @Intercogni
 **/

import {
    DefaultSrvReqType,
    DefaultSrvRespType
} from 'rosreact/dist/esm/components/ServiceCaller/ServiceCaller'
import { RosLib, useRememberedRos } from '../common/components'
import { Fragment, useEffect } from 'react'

export default function RosServiceClient({
    name,
    service_type,
    trigger,
    request,
    callback,
    errorHandler
}: {
    name          : any
    service_type  : any
    trigger       : any
    request       : any
    callback      : any
    errorHandler ?: any
}) {
    // Remember the ROS mentioned in the wrapper of this element
    const RosInstance = useRememberedRos()

    // Call the service
    useEffect(() => {
        //console.log(`calling service: ${request.kp}`);
        const client = new RosLib.Service({
            ros         : RosInstance,
            name        : name,
            serviceType : service_type
        })
        const srv_request = new RosLib.ServiceRequest(request)
        client.callService(srv_request, callback, errorHandler)
    }, [trigger])

    // Return all the children of this element
    return <Fragment />
}

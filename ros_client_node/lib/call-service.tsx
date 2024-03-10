/**
 * ╭╴callService
 * ╰--> A ROS Function to call a ROS Service via a Websockets Connection
 * ╭╴Oportunitas (Taib Izzat Samawi); 21/Nov/2023
 * ╰--> @intercogni-ros-react | @Barunastra_ITS | @Intercogni
 **/

import ROSLIB from 'roslib'
import { RosLib } from '../../common/components'

export default function callService({
    ros,
    name,
    service_type,
    request,
    spinner,
    errorHandler
}: {
    ros           : any
    name          : any
    service_type  : any
    request      ?: any
    spinner       : any
    errorHandler  : any
}) {
    // Create an instance of a ROS Service
    const Service = new RosLib.Service({
        ros         : ros,
        name        : name,
        serviceType : service_type
    })

    // Convert input service parameter into an actual ROS Service Request
    const service_request = new RosLib.ServiceRequest(request)

    // Call the service
    Service.callService(service_request, spinner, errorHandler)
}

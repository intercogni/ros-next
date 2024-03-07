/**
* ╭╴RosServiceServer
* ╰--> A ROS Component used to Serve a ROS Service via a Websocket connection
* ╭╴Oportunitas (Taib Izzat Samawi); 21/Nov/2023
* ╰--> @intercogni-ros-react | @Barunastra_ITS | @Intercogni
**/

import { RosLib, useRememberedRos } from '../common/components';
import { Fragment, useEffect } from 'react';

export default function RosServiceServer({
    name,
    service_type,
    spinner,
} : {
    name: any,
    service_type: any,
    spinner: any,
}) {
    // Remember the ROS mentioned in the wrapper of this element
    const RosInstance = useRememberedRos();

    // Main Function/Core Spinner
    useEffect(() => {
        // Create a new ROS Service instance
        const Service = new RosLib.Service({
            ros: RosInstance,
            name: name,
            serviceType: service_type,
        });

        // Advertise/Spin server to Local Area Network
        Service.advertise(RosLib.wrapServerCallback(spinner));
        
        // Stop server advertisement in Local Area Network
        return (function() {
            Service.unadvertise();
        })
    }, []);

    // Return all the children of this element
    return <Fragment />
}
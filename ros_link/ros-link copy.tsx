/**
* ╭╴RosLink
* ╰--> A ROS Wrapper Component to Connect React Website to Topics using Websockets
* ╭╴Oportunitas (Taib Izzat Samawi); 15/Nov/2023
* ╰--> @intercogni-ros-react | @Barunastra_ITS | @Intercogni
**/

import { 
    RosContext,
    RosLib
} from '../common/components';
import DefaultRosLinkProps from './lib/default-ros-link-props';
import {
    useEffect,
    useState,
} from 'react';

export default function RosLink({ 
    ip_address,
    port,
    children,
    ...userProps
}: {
    ip_address: string,
    port: string,
    children: React.ReactNode,
}) {
    // Move props parameter into a single const
    const props = { ...DefaultRosLinkProps, ...userProps };

    // Create ROS Instance
    const RosInstance = new RosLib.Ros({
        url: `ws://${ip_address}:${port}`
    });
    
    // Trigger on URL Change
    const [this_url, setThisUrl] = useState(props.url);
    useEffect(() => {
        setThisUrl(props.url);
    }, [props.url]);

    // Local-scope auto_connect status
    const [this_auto_connect, setThisAutoConnect] = useState(props.auto_connect);
    useEffect(() => {
        setThisAutoConnect(props.auto_connect);
    }, [props.auto_connect]);

    // ROS Websockets Link
    const [link_status, setLinkStatus] = useState(false);
    useEffect(() => { 
        // Connection Status Logger
        RosInstance.on('connection', () => {
            console.warn(`Established RosBridge Websocket Connection to ${this_url}`);
            setLinkStatus(true);
        });
        RosInstance.on('error', (error: any) => {
            console.warn(`Error Establishing RosBridge Websocket Connection to ${this_url}`, error);

            // Attempt to reconnect if <auto_connect> is enabled
            if (this_auto_connect === true) {
                setTimeout(() => {
                    RosInstance.connect(this_url);
                })
            }
        });
        RosInstance.on('close', (error: any) => {
            console.warn(`Closed RosBridge Websocket Connection to ${this_url}`);
            setLinkStatus(false);
        });
    }, [link_status]);

    return (
        <RosContext.Provider value={RosInstance}>
            {children}
        </RosContext.Provider>
    );
};
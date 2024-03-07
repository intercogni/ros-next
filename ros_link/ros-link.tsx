import { sha512 } from 'js-sha512';
import PropTypes from 'prop-types';
import React, {
    createContext,
    PropsWithChildren,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import { 
    RosContext,
    RosLib
} from '../common/components';

import { getRosObject } from './lib/ros-instance-manager';

interface RosConnectionProps {
    url?: string;
    autoConnect?: boolean;
    autoConnectTimeout?: number;
    user?: string;
    password?: string;
}

const DefaultRosProps: Required<RosConnectionProps> = {
    url: 'ws://127.0.0.1:9090',
    autoConnect: false,
    autoConnectTimeout: 1000,
    user: '',
    password: '',
};

export default function RosConnection({
    children,
    ...userProps
}: PropsWithChildren<Partial<RosConnectionProps>>
) {
    const props = { ...DefaultRosProps, ...userProps };
    const [url, setUrl] = useState(props.url);
    const rosRef = useRef<typeof RosLib.Ros>(new RosLib.Ros({}));

    // Trigger update if URL changes
    useEffect(() => {
        setUrl(props.url);
    }, [props.url]);

    useEffect(() => {
        rosRef.current = getRosObject(url);

        setupConnectionCallbacks(
            rosRef.current,
            url,
            props.autoConnect,
            props.autoConnectTimeout,
            props.user,
            props.password,
        );
        connect(rosRef.current, url, props.user, props.password);
        return () => {
            closeConnection(rosRef.current);
        };
    }, [
        url,
        props.autoConnect,
        props.autoConnectTimeout,
        props.password,
        props.user,
    ]);

    return <RosContext.Provider value={rosRef.current}>{children}</RosContext.Provider>;
};

RosConnection.propTypes = {
    children: PropTypes.node.isRequired,
    url: PropTypes.string.isRequired,
    autoConnect: PropTypes.bool,
    autoConnectTimeout: PropTypes.number,
    user: PropTypes.string,
    password: PropTypes.string,
};

export function setupConnectionCallbacks(
    ros: typeof RosLib.Ros,
    url = DefaultRosProps.url,
    autoConnect = DefaultRosProps.autoConnect,
    autoConnectTimeout = DefaultRosProps.autoConnectTimeout,
    user = DefaultRosProps.user,
    password = DefaultRosProps.password,
): void {
    ros.on('connection', () => {
        //console.log('Connected');
    });
    ros.on('close', () => {
        //console.log('Disconnected');
    });
    ros.on('error', () => {
        //console.log('Connection error');

        // Attempt to reconnect
        if (autoConnect) {
            setTimeout(() => {
                connect(ros, url, user, password);
            }, autoConnectTimeout);
        }
    });
}

export function connect(
    ros: typeof RosLib.Ros,
    url = DefaultRosProps.url,
    user = DefaultRosProps.user,
    password = DefaultRosProps.password,
): void {
    ros.connect(url);
}

export function closeConnection(ros: typeof RosLib.Ros): void {
    ros.close();
}

class AuthenticationMessage {
    secret: string;
    client: string;
    dest: string;
    rand: string;
    time: number;
    timeEnd: number;
    level: string;

    constructor(url: string, user: string, password: string) {
        this.dest = url;
        this.client = user;
        this.secret = password;
        this.rand = 'randomstring';
        this.time = new Date().getTime();
        this.level = 'user';
        this.timeEnd = this.time;
    }

    getMac() {
        return sha512(
            this.secret +
                this.client +
                this.dest +
                this.rand +
                this.time.toString() +
                this.level +
                this.timeEnd.toString(),
        );
    }
}
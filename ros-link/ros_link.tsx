import { sha512 } from 'js-sha512'
import PropTypes from 'prop-types'
import React, {
    createContext,
    PropsWithChildren,
    useContext,
    useEffect,
    useRef,
    useState
} from 'react'
import { RosContext, RosLib } from '../common/components'
import { getRosObject } from './lib/ros-instance-manager'

interface RosConnectionProps {
    url                ?: string
    autoConnect        ?: boolean
    autoConnectTimeout ?: number
    user               ?: string
    password           ?: string
}

export default function RosConnection({
    url,
    auto_connect,
    auto_connect_timeout,
    user,
    password,
    children,
    ...userProps
}: {
    url                   : string
    auto_connect         ?: boolean
    auto_connect_timeout ?: number
    user                 ?: string
    password             ?: string
    children              : any,
}) {
    const rosRef        = useRef<typeof RosLib.Ros>(new RosLib.Ros({}))
    const ThisRos       = useContext(RosContext)

    const [tick, setTick] = useState(false)
    setInterval(() => {
        setTick(!tick)
    }, 500)
    
    useEffect(() => {
        rosRef.current = getRosObject(url)

        setupConnectionCallbacks(
            rosRef.current,
            url,
            auto_connect,
            auto_connect_timeout,
            user,
            password
        )
        connect(rosRef.current, url, user, password)
    }, [
        url,
        auto_connect,
        auto_connect_timeout,
        password,
        user,
        tick
    ])

    return (
        <RosContext.Provider value = {rosRef.current}>
            {children}
        </RosContext.Provider>
    )
}

export function setupConnectionCallbacks(
    ros : typeof RosLib.Ros,
    url : any,
    auto_connect ?: any,
    auto_connect_timeout ?: any,
    user ?: any,
    password ?: any
): void {
    ros.on('connection', () => {
        console.log(`Established ROS connection to ${url}`)
    })
    ros.on('close', () => {
        console.log(`Closed ROS connection to ${url}`);
    })
    ros.on('error', () => {
        console.log(`Error establishing ROS connection to ${url}`);

        // Attempt to reconnect
        if (auto_connect) {
            setTimeout(() => {
                connect(ros, url, user, password)
            }, auto_connect_timeout)
        }
    })
}

export function connect(
    ros : typeof RosLib.Ros,
    url : string,
    user ?: string,
    password ?: string
): void {
    ros.connect(url)
}

export function closeConnection(ros: typeof RosLib.Ros): void {
    ros.close()
}

class AuthenticationMessage {
    secret  : string
    client  : string
    dest    : string
    rand    : string
    time    : number
    timeEnd : number
    level   : string

    constructor(url: string, user: string, password: string) {
        this.dest    = url
        this.client  = user
        this.secret  = password
        this.rand    = 'randomstring'
        this.time    = new Date().getTime()
        this.level   = 'user'
        this.timeEnd = this.time
    }

    getMac() {
        return sha512(
            this.secret +
                this.client +
                this.dest +
                this.rand +
                this.time.toString() +
                this.level +
                this.timeEnd.toString()
        )
    }
}

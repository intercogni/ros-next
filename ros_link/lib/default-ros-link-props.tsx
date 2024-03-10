import RosLinkProps from './ros-link-props'

const DefaultRosLinkProps: Required<RosLinkProps> = {
    url                  : 'ws://127.0.0.1.9090',
    auto_connect         : false,
    auto_connect_timeout : 1000
}

export default DefaultRosLinkProps

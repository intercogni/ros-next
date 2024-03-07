export default interface TopicProps {
    topic           : string;
    messageType     : string;
    throttleRate   ?: number;
    latch          ?: boolean;
    queueLength    ?: number;
    queueSize      ?: number;
}
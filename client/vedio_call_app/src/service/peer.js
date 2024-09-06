class Peerservice{
    /*This is a core part of the WebRTC API that handles the connection between two peers (web browsers, in most cases).
The RTCPeerConnection is set up with some ICE (Interactive Connectivity Establishment) servers. */
    constructor(){
        if(!this.peer)
        {
            this.peer = new RTCPeerConnection({
                iceServers: [
                    {
                        urls:[
                            'stun:stun.l.google.com:19302',
                            'stun:global.stun.twilio.com:3478',
                        ],
                    },
                ],
            });
        }
    }
    async getanswer(offer)
    {
        if(this.peer)
        {
            await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
            const ans= await this.peer.createAnswer();
            await this.peer.setLocalDescription(new RTCSessionDescription(ans));//Set Local Description: It then sets this answer as the local description,                                                                      //which prepares the system for the connection.
            return ans;
        }
    }

    async setLocalDescription(ans)
    {
        if(this.peer)
        {
            await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
        }
    }

    async getoffer()
    {
        if(this.peer)
        {
            const offer=await this.peer.createOffer();//An offer is a message sent from one peer to another, indicating that it wants to start communication.
            await this.peer.setLocalDescription(new RTCSessionDescription(offer));//RTCSessionDescription is a specific type of object that formats the offer properly.
             //Here, offer is the information created earlier with createOffer(). It includes details that help set up the connection, such as codecs and media stream types.
            return offer;
        }
    }
}
export default new Peerservice();

/*The Peerservice class is designed to set up a connection for real-time communication using 
WebRTC, which is a technology that allows audio, video, and data sharing in web applications.*/


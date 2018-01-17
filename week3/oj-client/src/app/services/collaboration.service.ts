import { Injectable } from '@angular/core';

declare  const io: any;

@Injectable()
export class CollaborationService {
  collaborationSocket: any;
  constructor() { }
  init(editor: any, sessionId: string): void {
    this.collaborationSocket = io(window.location.origin, {query: 'sessionId=' + sessionId});
    // this.colllaborationSocket.on('message', (message) => {
    //   console.log("message received from server: " + message);
    // });
    //register on listen fn
    this.collaborationSocket.on('change', (delta: string) => {
      delta = JSON.parse(delta);
      editor.lastAppliedChange = delta;
      editor.getSession().getDocument().applyDeltas([delta]);
    });
  }
  change(delta: string): void {
    console.log("change to be sent" + delta);
    this.collaborationSocket.emit('change', delta);
  }
  restoreBuffer() : void {
    this.collaborationSocket.emit('restoreBuffer');
  }
}

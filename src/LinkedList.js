class _Node {
  constructor(value, next){
      this.value = value;
      this.next = next;
  }
}

class LinkedList {
  constructor(){
      this.head = null;
  }

  insertFirst(item) {
      this.head = new _Node(item, this.head);
  }

  insertLast(item){
      if(this.head === null){
          this.insertFirst(item);
      } else {
          let tempNode = this.head;
          while (tempNode.next !== null) {
              tempNode = tempNode.next;
          }
          tempNode.next = new _Node(item, null);
      }
  }

  remove(item){
      if(!this.head){
          return null;
      }

      if(this.head.value === item){
          this.head = this.head.next
      }

      let currNode = this.head;
      let previousNode = this.head;

      while((currNode !== null) && (currNode.value !== item)){
          previousNode = currNode;
          currNode= currNode.next;
      }

      if(currNode === null){
          console.log('Item not found');
          return;
      }
      previousNode.next = currNode.next;
  }

  find(item){
      let currNode = this.head;

      if(!this.head){
          return null;
      }

      while(currNode.value !== item){
          if(currNode.next === null){
              return null;
          } else {
              currNode = currNode.next;
          }
      }

      return currNode;
  }

  insertBefore(item, target){
      if(!this.head){
          this.insertFirst(item);
      }

      let tempNode = this.head;
      let prevNode = this.head;
      while(tempNode !== null && tempNode.value !== target){
        prevNode = tempNode;
        tempNode = tempNode.next;
      }
      if(tempNode === null){
        console.log('Item not found');
        return;
      }
      prevNode.next = new _Node(item, prevNode.next)
  }

  insertAfter(item, target){
    if(!this.head){
      this.insertFirst(item);
    }

    let tempNode = this.head;
    while(tempNode.next !== null && tempNode.value !== target){
      tempNode = tempNode.next;
    }
    if(tempNode === null){
      console.log('Item not found');
      return;
    }
    let newNode = new _Node(item, tempNode.next);
    tempNode.next = newNode;
  }

  insertAt(item, pos){
    let tempNode = this.head;
    let currNode = this.head;
    for(let i = 0; i < pos - 1; i++){
      tempNode = currNode;
      currNode = currNode.next;
    }
    if(currNode === null){
      console.log('Item not found');
      return;
    }
    tempNode.next = new _Node(item, currNode);
  }
}

module.exports = LinkedList;
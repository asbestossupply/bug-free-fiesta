const HOUR_MS = 60 * 60 * 1000;

class LinkedList {
    constructor(val) {
        this.val = val;
        this.next = null;
    }
}

class HourlyLimiter {
    constructor(num_per_hour) {
        this.num_per_hour = num_per_hour;
        this.head = null;
        this.tail = null;
        this.item_count = 0;
    }

    prune_before(ms) {
        let current_item = this.head;
        while(current_item && current_item.val < ms) {
            current_item = current_item.next;
            this.item_count -= 1;
        }

        this.head = current_item;
        if (!current_item) {
            this.tail = current_item;
        }
    };

    incr() {
        const now = Date.now();

        this.prune_before(now - HOUR_MS);

        if (this.item_count >= this.num_per_hour) {
            throw Error('over limit');
        }

        const nextItem = new LinkedList(now);
        this.item_count += 1;
        if (this.head == null) {
            this.head = this.tail = nextItem;
        } else {
            this.tail.next = nextItem;
            this.tail = nextItem;
        }
    }
}
module.exports.HourlyLimiter = HourlyLimiter;
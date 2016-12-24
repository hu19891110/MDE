"use strict";
const util_1 = require("../util");
class ScrollBarTrain extends util_1.DomHelper.AbsoluteElement {
    constructor() {
        super("div", "mde-scrollbar-train");
    }
    dispose() {
    }
}
class TrainMoveEvent extends Event {
    constructor(_per) {
        super("trainMove");
        this._percentage = _per;
    }
    get percentage() {
        return this._percentage;
    }
}
exports.TrainMoveEvent = TrainMoveEvent;
class ScrollBarView extends util_1.DomHelper.AbsoluteElement {
    constructor() {
        super("div", "mde-scrollbar");
        this._mouseMove = null;
        this._mouseUp = null;
        this._train = new ScrollBarTrain();
        this._train.appendTo(this._dom);
        this.width = ScrollBarView.DefaultWidth;
        let clickOffset = 0;
        let mouseMove = (evt) => {
            let rect = this._dom.getBoundingClientRect(), trainTop = evt.clientY - clickOffset - rect.top, percentage = trainTop / (this.height - this._train.height);
            if (percentage < ScrollBarView.DefaultScrollAlpha) {
                percentage = 0;
            }
            else if (percentage > (1 - ScrollBarView.DefaultScrollAlpha)) {
                percentage = 1;
            }
            if (percentage >= 0 && percentage <= 1) {
                this.trainPositionPercentage = percentage;
                let event = new TrainMoveEvent(percentage);
                this._dom.dispatchEvent(event);
            }
        };
        this._train.on("mousedown", (evt) => {
            evt.preventDefault();
            window.addEventListener("mousemove", mouseMove, true);
            this._mouseMove = mouseMove;
            clickOffset = evt.offsetY;
        });
        this._mouseUp = (evt) => {
            window.removeEventListener("mousemove", mouseMove, true);
            this._mouseMove = null;
        };
        window.addEventListener("mouseup", this._mouseUp, true);
    }
    set trainHeight(h) {
        this._train.height = h;
    }
    set trainHeightPercentage(hp) {
        hp = Math.floor(hp * 100) / 100;
        if (hp < 0 || hp > 1)
            throw new Error("Data should be between 0 and 1: " + hp);
        this._train.height = this.height * hp;
    }
    set trainTop(h) {
        this._train.top = h;
    }
    set trainPositionPercentage(per) {
        per = Math.floor(per * 10000) / 10000;
        if (per < 0 || per > 1)
            throw new Error("Data should be between 0 and 1: " + per);
        this._train.top = (this.height - this._train.height) * per;
    }
    set width(w) {
        super.width = w;
        this._train.width = w;
    }
    get width() {
        return super.width;
    }
    set height(h) {
        let oldTrainHeightPercentage = this._train.height / this.height, oldTrainTopPercentage = this._train.top / (this.height - this._train.height);
        super.height = h;
        if (this.height > 0 && this._train.height > 0 && (this.height - this._train.height) > 0) {
            this.trainHeightPercentage = oldTrainHeightPercentage;
            this.trainPositionPercentage = oldTrainTopPercentage;
        }
    }
    get height() {
        return super.height;
    }
    dispose() {
        this._train.dispose();
        if (this._mouseMove !== null) {
            window.removeEventListener("mousemove", this._mouseMove, true);
        }
        window.removeEventListener("mouseup", this._mouseUp, true);
    }
}
ScrollBarView.DefaultWidth = 18;
ScrollBarView.DefaultScrollAlpha = 0.01;
exports.ScrollBarView = ScrollBarView;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy92aWV3L3ZpZXdTY3JvbGxCYXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHVCQUFxQyxTQUVyQyxDQUFDLENBRjZDO0FBRTlDLDZCQUE2QixnQkFBUyxDQUFDLGVBQWU7SUFFbEQ7UUFDSSxNQUFNLEtBQUssRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFRCxPQUFPO0lBQ1AsQ0FBQztBQUVMLENBQUM7QUFFRCw2QkFBb0MsS0FBSztJQUdyQyxZQUFZLElBQUk7UUFDWixNQUFNLFdBQVcsQ0FBQyxDQUFDO1FBQ25CLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO0lBQzVCLENBQUM7SUFFRCxJQUFJLFVBQVU7UUFDVixNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUM1QixDQUFDO0FBRUwsQ0FBQztBQVpZLHNCQUFjLGlCQVkxQixDQUFBO0FBRUQsNEJBQ1ksZ0JBQVMsQ0FBQyxlQUFlO0lBU2pDO1FBQ0ksTUFBTSxLQUFLLEVBQUUsZUFBZSxDQUFDLENBQUM7UUFKMUIsZUFBVSxHQUFtQixJQUFJLENBQUM7UUFDbEMsYUFBUSxHQUFtQixJQUFJLENBQUM7UUFLcEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO1FBQ25DLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVoQyxJQUFJLENBQUMsS0FBSyxHQUFHLGFBQWEsQ0FBQyxZQUFZLENBQUM7UUFFeEMsSUFBSSxXQUFXLEdBQVcsQ0FBQyxDQUFDO1FBQzVCLElBQUksU0FBUyxHQUFHLENBQUMsR0FBZTtZQUM1QixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLHFCQUFxQixFQUFFLEVBQ3hDLFFBQVEsR0FBRyxHQUFHLENBQUMsT0FBTyxHQUFHLFdBQVcsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUMvQyxVQUFVLEdBQUcsUUFBUSxHQUFHLENB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Q0FBQyxDQUFVO1FBQ2hCLEtBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztJQUMxQixDQUFDO0lBRUQsSUFBSSxLQUFLO1FBQ0wsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7SUFDdkIsQ0FBQztJQUVELElBQUksTUFBTSxDQUFDLENBQVM7UUFDaEIsSUFBSSx3QkFBd0IsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxFQUMzRCxxQkFBcUIsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVqRixLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUNqQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUV0RixJQUFJLENBQUMscUJBQXFCLEdBQUcsd0JBQXdCLENBQUM7WUFDdEQsSUFBSSxDQUFDLHVCQUF1QixHQUFHLHFCQUFxQixDQUFDO1FBQ3pELENBQUM7SUFDTCxDQUFDO0lBRUQsSUFBSSxNQUFNO1FBQ04sTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7SUFDeEIsQ0FBQztJQUVELE9BQU87UUFDSCxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3RCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztZQUMzQixNQUFNLENBQUMsbUJBQW1CLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDbkUsQ0FBQztRQUNELE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUMvRCxDQUFDO0FBRUwsQ0FBQztBQTNHMEIsMEJBQVksR0FBRyxFQUFFLENBQUM7QUFDbEIsZ0NBQWtCLEdBQUcsSUFBSSxDQUFDO0FBSnhDLHFCQUFhLGdCQThHekIsQ0FBQSIsImZpbGUiOiJ2aWV3L3ZpZXdTY3JvbGxCYXIuanMiLCJzb3VyY2VSb290Ijoic3JjLyJ9

let dragObject = {};


$("body").on("mousedown", ".draggable", function (ev) {
    console.log("Click on card");
   dragObject.elem = this;
   dragObject.downX = ev.pageX;
   dragObject.downY = ev.pageY;
});

$("body").on("mousemove", ".draggable", function (ev) {
    if (!dragObject.elem) {
        console.log("Move on not clicked card");
        return;
    }

    if (!dragObject.avatar) {
        console.log("Move on clicked card, create avatar");
        let moveX = ev.pageX - dragObject.downX;
        let moveY = ev.pageY - dragObject.downY;
        if (Math.abs(moveX) < 3 && Math.abs(moveY) < 3) return;

        dragObject.avatar = createAvatar(ev);
        if (!dragObject.avatar) {
            dragObject = {};
            return;
        }

        let coordinates = getCoordinates(dragObject.avatar);
        dragObject.shiftX = dragObject.downX - coordinates.left;
        dragObject.shiftY = dragObject.downY - coordinates.top;

        startDrag(ev);
    }

    dragObject.avatar.style.left = ev.pageX - dragObject.shiftX + 'px';
    dragObject.avatar.style.right = ev.pageY - dragObject.shiftY + 'px';
});

$("body").on("mouseup", ".draggable", function (ev) {
   if (dragObject.avatar) {
       console.log("Finish drag");
       finishDrag(ev);
   }
   dragObject = {};
});

function createAvatar(ev) {
    let avatar = dragObject.elem;
    let old = {
        parent: avatar.parentNode,
        nextSibling: avatar.nextSibling,
        position: avatar.position || "",
        left: avatar.left || "",
        top: avatar.top || "",
        zIndex: avatar.zIndex || ""
    };

    avatar.rollback = function () {
        old.parent.insertBefore(avatar, old.nextSibling);
        avatar.style.position = old.position;
        avatar.style.left = old.left;
        avatar.style.top = old.top;
        avatar.style.zIndex = old.zIndex;
    };

    return avatar;
}

function startDrag(ev) {
    let avatar = dragObject.avatar;
    document.body.appendChild(avatar);
    avatar.style.zIndex = 999;
    avatar.style.position = "absolute"
}

function getCoordinates(elem) {
    let box = elem.getBoundingClientRect();
    return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
    };
}

function finishDrag(ev) {
    let dropElem = findDroppable(ev);

    if (dropElem) {
        onDragEnd(dropElem);
    } else {
        onDragCancel();
    }
}

function findDroppable(ev) {
    dragObject.avatar.hidden = true;
    let elem = document.elementFromPoint(ev.clientX, ev.clientY);
    dragObject.avatar.hidden = false;
    if (elem == null) {
        return null;
    }
    return elem.closest(".droppable");
}

function onDragEnd(elem) {
    console.log("Success");
}

function onDragCancel() {
    console.log("rollback");
}
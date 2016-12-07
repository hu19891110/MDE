import {DomHelper, IDisposable} from "../util"
import {Position, PositionUtil} from "../model"
import {Coordinate} from "."
import {InputerView} from "./viewInputer"
import {CursorView} from "./viewCursor"

export class SelectionAtom extends DomHelper.AbsoluteElement {

    constructor() {
        super("div", "mde-document-selection-atom");
        this._dom.style.zIndex = "-1";
    }

}

export class SelectionManager implements IDisposable {

    public static readonly DefalutLineHeight = 22;

    private _begin_pos: Position = null;
    private _end_pos: Position = null;

    private _lineMargin: number;
    private _docWidth: number;
    private _coordinate_offset_thunk: () => Coordinate;
    private _coGetter: (pos: Position) => Coordinate;
    private _father_dom: HTMLElement;

    private _top_atom: SelectionAtom = null;
    private _middle_atom: SelectionAtom = null;
    private _end_atom: SelectionAtom = null;

    private _cursor: CursorView = null;
    private _inputer: InputerView = null;

    constructor(lineMargin: number, docWidth: number, absCoGetter: (pos: Position) => Coordinate, 
        begin: Position, end?: Position) {

        this._lineMargin = lineMargin;
        this._docWidth = docWidth;
        this._coGetter = absCoGetter;
        this._begin_pos = PositionUtil.clonePosition(begin);
        this._end_pos = end ? PositionUtil.clonePosition(end) : PositionUtil.clonePosition(begin);
    }

    binding(_father_dom: HTMLElement) {
        this._father_dom = _father_dom;

        // this._cursor.appendTo(this._father_dom);
        // this._inputer.appendTo(this._father_dom);
        this.paint();
    }

    resetEnd(end: Position) {
        if (end !== this._end_pos) {
            this._end_pos = PositionUtil.clonePosition(end);
            if (PositionUtil.equalPostion(this._begin_pos, this._end_pos)) this.clearAll();
            else this.paint();
        }
    }

    repaint() {
        this.paint();
    }

    collapse() {
        this._end_pos = null;
        this.clearAll();
        this._inputer.dispose();
        this._cursor.dispose();
    }

    setDocumentWidth(w: number) {
        this._docWidth = w;
        this.repaint();
    }

    get collapsed() {
        return this._end_pos === null || this._end_pos === undefined || 
            PositionUtil.equalPostion(this._begin_pos, this._end_pos);
    }

    private clearAll() {
        if (this._top_atom) {
            this._top_atom.remove();
            this._top_atom = null;
        }
        if (this._middle_atom) {
            this._middle_atom.remove();
            this._middle_atom = null;
        }
        if (this._end_atom) {
            this._end_atom.remove();
            this._end_atom = null;
        }
    }

    private paint() {

        if (this._begin_pos && this._end_pos && 
            !PositionUtil.equalPostion(this._begin_pos, this._end_pos)) {

            let begin_pos: Position,
                end_pos: Position;
            
            if (PositionUtil.greaterPosition(this._end_pos, this._begin_pos)) {
                begin_pos = this._begin_pos;
                end_pos = this._end_pos;
            } else {
                begin_pos = this._end_pos;
                end_pos = this._begin_pos;
            }

            let beginCo = this._coGetter(begin_pos),
                endCo = this._coGetter(end_pos);

            if (beginCo.y === endCo.y) {

                if (this._top_atom === null) {
                    this._top_atom = new SelectionAtom();
                    this._top_atom.appendTo(this._father_dom);
                }
                if (this._middle_atom !== null) {
                    this._middle_atom.remove();
                    this._middle_atom = null;
                }
                if (this._end_atom !== null) {
                    this._end_atom.remove();
                    this._end_atom = null;
                }

                this._top_atom.width = endCo.x - beginCo.x;
                this._top_atom.height = SelectionManager.DefalutLineHeight;

                this._top_atom.marginLeft = beginCo.x;
                this._top_atom.top = beginCo.y;

            } else {

                if (this._top_atom === null) {
                    this._top_atom = new SelectionAtom();
                    this._top_atom.appendTo(this._father_dom);
                }
                if (this._middle_atom === null) {
                    this._middle_atom = new SelectionAtom();
                    this._middle_atom.appendTo(this._father_dom);
                }
                if (this._end_atom === null) {
                    this._end_atom = new SelectionAtom();
                    this._end_atom.appendTo(this._father_dom);
                }

                this._top_atom.height = this._end_atom.height = SelectionManager.DefalutLineHeight;
                
                this._top_atom.marginLeft = beginCo.x;
                this._top_atom.width = this._docWidth - beginCo.x;
                this._top_atom.top = beginCo.y;

                this._middle_atom.width = this._docWidth - this._lineMargin;
                this._middle_atom.height = endCo.y - beginCo.y - this._top_atom.height;
                this._middle_atom.top = beginCo.y + this._top_atom.height;
                this._middle_atom.marginLeft = this._lineMargin;

                this._end_atom.top = endCo.y;
                this._end_atom.width = endCo.x - this._lineMargin;
                this._end_atom.marginLeft = this._lineMargin;
            }
        }
    }

    get beginPosition() {
        return this._begin_pos;
    }

    get endPosition() {
        return this._end_pos;
    }

    dispose() {
        // this._inputer.dispose();
        // this._cursor.dispose();
    }

    remove() {
        this.clearAll();
        // this._inputer.remove();
        // this._cursor.remove();
    }

}
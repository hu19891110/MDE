"use strict";
(function (MarkdownTokenType) {
    MarkdownTokenType[MarkdownTokenType["Space"] = 0] = "Space";
    MarkdownTokenType[MarkdownTokenType["Hr"] = 1] = "Hr";
    MarkdownTokenType[MarkdownTokenType["Heading1"] = 2] = "Heading1";
    MarkdownTokenType[MarkdownTokenType["Heading2"] = 3] = "Heading2";
    MarkdownTokenType[MarkdownTokenType["Heading3"] = 4] = "Heading3";
    MarkdownTokenType[MarkdownTokenType["Code"] = 5] = "Code";
    MarkdownTokenType[MarkdownTokenType["Table"] = 6] = "Table";
    MarkdownTokenType[MarkdownTokenType["BlockquoteStart"] = 7] = "BlockquoteStart";
    MarkdownTokenType[MarkdownTokenType["ListStart"] = 8] = "ListStart";
    MarkdownTokenType[MarkdownTokenType["ListItemStart"] = 9] = "ListItemStart";
    MarkdownTokenType[MarkdownTokenType["LooseItemStart"] = 10] = "LooseItemStart";
    MarkdownTokenType[MarkdownTokenType["Html"] = 11] = "Html";
    MarkdownTokenType[MarkdownTokenType["Paragraph"] = 12] = "Paragraph";
    MarkdownTokenType[MarkdownTokenType["Text"] = 13] = "Text";
    MarkdownTokenType[MarkdownTokenType["Bold"] = 14] = "Bold";
    MarkdownTokenType[MarkdownTokenType["Italic"] = 15] = "Italic";
    MarkdownTokenType[MarkdownTokenType["Pre"] = 16] = "Pre";
})(exports.MarkdownTokenType || (exports.MarkdownTokenType = {}));
var MarkdownTokenType = exports.MarkdownTokenType;
class MarkdownTokenizeState {
    constructor() {
        this._is_start_of_line = true;
        this._in_pre = false;
        this._in_bold = false;
        this._in_italic = false;
        this._is_blockquote = false;
        this._title_level = 0;
    }
    copy() {
        let newObj = new MarkdownTokenizeState();
        newObj._in_bold = this._in_bold;
        newObj._in_italic = this._in_italic;
        newObj._in_pre = this._in_pre;
        return newObj;
    }
    get isStartOfLine() { return this._is_start_of_line; }
    set isStartOfLine(v) { this._is_start_of_line = v; }
    get inPre() { return this._in_pre; }
    set inPre(v) { this._in_pre = v; }
    get inBold() { return this._in_bold; }
    set inBold(v) { this._in_bold = v; }
    get inItalic() { return this._in_italic; }
    set inItalic(v) { this._in_italic = v; }
    get isBlockquote() { return this._is_blockquote; }
    set isBlockquote(v) { this._is_blockquote = v; }
    get titleLevel() { return this._title_level; }
    set titleLevel(v) { this._title_level = v; }
}
exports.MarkdownTokenizeState = MarkdownTokenizeState;
class MarkdownTokenizer {
    startState() {
        return new MarkdownTokenizeState();
    }
    tokenize(stream, state) {
        if (state.isStartOfLine) {
            stream.eatWhile();
            if (stream.match(/^###/, true)) {
                state.inPre = false;
                state.inBold = false;
                state.inItalic = false;
                stream.skipToEnd();
                return MarkdownTokenType.Heading3;
            }
            else if (stream.match(/^##/, true)) {
                state.inPre = false;
                state.inBold = false;
                state.inItalic = false;
                stream.skipToEnd();
                return MarkdownTokenType.Heading2;
            }
            else if (stream.match(/^#/, true)) {
                state.inPre = false;
                state.inBold = false;
                state.inItalic = false;
                stream.skipToEnd();
                return MarkdownTokenType.Heading1;
            }
            else if (stream.match(/^-([^-]+|$)/, false)) {
                stream.next();
                return MarkdownTokenType.ListItemStart;
            }
            else if (stream.match(/^>/, true)) {
                return MarkdownTokenType.BlockquoteStart;
            }
            else if (stream.match(/^\d+\./, false)) {
                stream.eat(/^\d+/);
                return MarkdownTokenType.ListItemStart;
            }
            state.isStartOfLine = false;
        }
        if (state.inBold) {
            while (stream.skipTo("*")) {
                if (stream.match(/\*\*/, true)) {
                    state.inBold = false;
                    return MarkdownTokenType.Bold;
                }
                else {
                    stream.next();
                }
            }
            stream.skipToEnd();
            return MarkdownTokenType.Bold;
        }
        else if (state.inItalic) {
            if (stream.skipTo("*")) {
                stream.next();
                state.inItalic = false;
            }
            else
                stream.skipToEnd();
            return MarkdownTokenType.Italic;
        }
        else if (state.inPre) {
            stream.skipTo("`");
            if (stream.match(/^`+/, true)) {
                state.inPre = false;
                return MarkdownTokenType.Pre;
            }
            stream.skipToEnd();
            return MarkdownTokenType.Pre;
        }
        else {
            if (stream.match(/^\*\*/, true)) {
                state.inBold = true;
                return MarkdownTokenType.Bold;
            }
            else if (stream.match(/^\*/, true)) {
                state.inItalic = true;
                return MarkdownTokenType.Italic;
            }
            else if (stream.match(/^`+/, true)) {
                state.inPre = true;
                return MarkdownTokenType.Pre;
            }
        }
        stream.next();
        return MarkdownTokenType.Text;
    }
    copyState(state) {
        return state.copy();
    }
}
exports.MarkdownTokenizer = MarkdownTokenizer;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlsL21hcmtkb3duVG9rZW5pemVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFHQSxXQUFZLGlCQUFpQjtJQUN6QiwyREFBSyxDQUFBO0lBQ0wscURBQUUsQ0FBQTtJQUNGLGlFQUFRLENBQUE7SUFDUixpRUFBUSxDQUFBO0lBQ1IsaUVBQVEsQ0FBQTtJQUNSLHlEQUFJLENBQUE7SUFDSiwyREFBSyxDQUFBO0lBQ0wsK0VBQWUsQ0FBQTtJQUNmLG1FQUFTLENBQUE7SUFDVCwyRUFBYSxDQUFBO0lBQ2IsOEVBQWMsQ0FBQTtJQUNkLDBEQUFJLENBQUE7SUFDSixvRUFBUyxDQUFBO0lBQ1QsMERBQUksQ0FBQTtJQUNKLDBEQUFJLENBQUE7SUFBRSw4REFBTSxDQUFBO0lBQUUsd0RBQUcsQ0FBQTtBQUNyQixDQUFDLEVBaEJXLHlCQUFpQixLQUFqQix5QkFBaUIsUUFnQjVCO0FBaEJELElBQVksaUJBQWlCLEdBQWpCLHlCQWdCWCxDQUFBO0FBRUQ7SUFTSTtRQVBRLHNCQUFpQixHQUFZLElBQUksQ0FBQztRQUNsQyxZQUFPLEdBQVksS0FBSyxDQUFDO1FBQ3pCLGFBQVEsR0FBWSxLQUFLLENBQUM7UUFDMUIsZUFBVSxHQUFZLEtBQUssQ0FBQztRQUM1QixtQkFBYyxHQUFZLEtBQUssQ0FBQztRQUNoQyxpQkFBWSxHQUFXLENBQUMsQ0FBQztJQUlqQyxDQUFDO0lBRUQsSUFBSTtRQUNBLElBQUksTUFBTSxHQUFHLElBQUkscUJBQXFCLEVBQUUsQ0FBQztRQUV6QyxNQUFNLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDaEMsTUFBTSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUU5QixNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFFRCxJQUFJLGFBQWEsS0FBSyxNQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztJQUN0RCxJQUFJLGFBQWEsQ0FBQyxDQUFVLElBQUksSUFBSSxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFN0QsSUFBSSxLQUFLLEtBQUssTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ3BDLElBQUksS0FBSyxDQUFDLENBQVUsSUFBSSxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFM0MsSUFBSSxNQUFNLEtBQUssTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQ3RDLElBQUksTUFBTSxDQUFDLENBQVUsSUFBSSxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFN0MsSUFBSSxRQUFRLEtBQUssTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQzFDLElBQUksUUFBUSxDQUFDLENBQVUsSUFBSSxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFakQsSUFBSSxZQUFZLEtBQUssTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO0lBQ2xELElBQUksWUFBWSxDQUFDLENBQVUsSUFBSSxJQUFJLENBQUMsY0FBYyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFekQsSUFBSSxVQUFVLEtBQUssTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO0lBQzlDLElBQUksVUFBVSxDQUFDLENBQVMsSUFBSSxJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFFeEQsQ0FBQztBQXpDWSw2QkFBcUIsd0JBeUNqQyxDQUFBO0FBR0Q7SUFFSSxVQUFVO1FBQ04sTUFBTSxDQUFDLElBQUkscUJBQXFCLEVBQUUsQ0FBQztJQUN2QyxDQUFDO0lBRUQsUUFBUSxDQUFDLE1BQWUsRUFBRSxLQUE0QjtRQUNsRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztZQUN0QixNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDbEIsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM3QixLQUFLLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztnQkFDcEIsS0FBSyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7Z0JBQ3JCLEtBQUssQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO2dCQUN2QixNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7Z0JBQ25CLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUM7WUFDdEMsQ0FBQztZQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25DLEtBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO2dCQUNwQixLQUFLLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztnQkFDckIsS0FBSyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7Z0JBQ3ZCLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQztnQkFDbkIsTUFBTSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQztZQUN0QyxDQUFDO1lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEMsS0FBSyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7Z0JBQ3BCLEtBQUssQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO2dCQUNyQixLQUFLLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztnQkFDdkIsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO2dCQUNuQixNQUFNLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDO1lBQ3RDLENBQUM7WUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM1QyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ2QsTUFBTSxDQUFDLGlCQUFpQixDQUFDLGFBQWEsQ0FBQztZQUMzQyxDQUFDO1lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLGVBQWUsQ0FBQztZQUM3QyxDQUFDO1lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdkMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDbkIsTUFBTSxDQUFDLGlCQUFpQixDQUFDLGFBQWEsQ0FBQztZQUMzQyxDQUFDO1lBQ0QsS0FBSyxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7UUFDaEMsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2YsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7Z0JBQ3hCLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDN0IsS0FBSyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7b0JBQ3JCLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUM7Z0JBQ2xDLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNsQixDQUFDO1lBQ0wsQ0FBQztZQUNELE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNuQixNQUFNLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDO1FBQ2xDLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDeEIsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JCLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDZCxLQUFLLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztZQUMzQixDQUFDO1lBQUMsSUFBSTtnQkFDRixNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDdkIsTUFBTSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQztRQUNwQyxDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbkIsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM1QixLQUFLLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztnQkFDcEIsTUFBTSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQztZQUNqQyxDQUFDO1lBQ0QsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ25CLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUM7UUFDakMsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM5QixLQUFLLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztnQkFDcEIsTUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQztZQUNsQyxDQUFDO1lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbkMsS0FBSyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7Z0JBQ3RCLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUM7WUFDcEMsQ0FBQztZQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25DLEtBQUssQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO2dCQUNuQixNQUFNLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDO1lBQ2pDLENBQUM7UUFDTCxDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2QsTUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQztJQUNsQyxDQUFDO0lBRUQsU0FBUyxDQUFDLEtBQTRCO1FBQ2xDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDeEIsQ0FBQztBQUVMLENBQUM7QUFyRlkseUJBQWlCLG9CQXFGN0IsQ0FBQSIsImZpbGUiOiJ1dGlsL21hcmtkb3duVG9rZW5pemVyLmpzIiwic291cmNlUm9vdCI6InNyYy8ifQ==
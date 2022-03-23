const MAX_COMMENT_LENGTH = 120;
const PREFER_SENTENCE_END_LENGTH = 80;

const idealCommentEnd = /[,.!?)\]>]/;
function findIdealCommentEnd(line: string) {
    for (let i = Math.min(120, line.length - 1); i > PREFER_SENTENCE_END_LENGTH; i--) {
        if (idealCommentEnd.test(line[i])) return i;
    }
    return line.lastIndexOf(" ", MAX_COMMENT_LENGTH);
}

export class CodeWriter {
    private readonly lines: string[] = [];

    private lastIsEmpty = true;

    private commentLines = 0;

    private indentation = "";

    private writeInstructionCount = 0;

    public getWriteInstructionCount() {
        return this.writeInstructionCount;
    }

    public begin(line: string) {
        this.writeInstructionCount++;
        this.finishComment();
        this.lines.push(this.indentation + line);
        this.indentation += "    ";
        this.lastIsEmpty = false;
    }

    public end(line: string) {
        this.writeInstructionCount++;
        if (this.commentLines > 0) throw new Error("Comment before block end");
        if (this.lastIsEmpty) {
            this.lines.pop();
            this.lastIsEmpty = false;
        }
        if (this.indentation.length < 4) throw new Error("Indentation too low");
        this.indentation = this.indentation.substr(0, this.indentation.length - 4);
        this.lines.push(this.indentation + line);
        this.emptyLine();
    }

    public comment(line: string) {
        line = line.trim();
        if (!line) return;
        for (const line2 of line.split("\n")) {
            this.commentSingleLine(line2);
        }
    }

    private commentSingleLine(line: string) {
        line = line.trim();
        if (!line) return;
        this.writeInstructionCount++;
        if (this.commentLines === 0) {
            this.lines.push(`${this.indentation}/**`);
        }
        while (line.length > MAX_COMMENT_LENGTH) {
            const index = findIdealCommentEnd(line);
            const part = line.substring(0, index + 1);
            this.lines.push(`${this.indentation} * ${part.trim()}`);
            line = line.substring(index + 1);
        }
        if (line.trim()) this.lines.push(`${this.indentation} * ${line.trim()}`);
        this.commentLines++;
        this.lastIsEmpty = false;
    }

    private finishComment() {
        if (this.commentLines > 0) {
            this.writeInstructionCount++;
            if (this.lastIsEmpty) {
                this.lines.pop();
                this.lastIsEmpty = false;
            }
            this.lines.push(`${this.indentation} */`);
            this.commentLines = 0;
        }
    }

    public code(line: string) {
        this.writeInstructionCount++;
        this.finishComment();
        this.lines.push(this.indentation + line);
        this.lastIsEmpty = false;
    }

    public emptyLine() {
        if (!this.lastIsEmpty) {
            this.writeInstructionCount++;
            if (this.commentLines > 0) this.lines.push(`${this.indentation} *`);
            else this.lines.push("");
            this.lastIsEmpty = true;
        }
    }

    public toString() {
        return this.lines.join("\n");
    }
}

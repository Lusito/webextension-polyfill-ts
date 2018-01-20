export class CodeWriter {
    private readonly lines: string[] = [];
    private lastIsEmpty = true;
    private commentLines = 0;
    private indentation = '';

    public begin(line: string) {
        if (this.commentLines > 0) {
            if (this.lastIsEmpty) 
                this.lines.pop();
            this.lines.push(this.indentation + ' */');
            this.commentLines = 0;
        }
        this.lines.push(this.indentation + line);
        this.indentation += '    ';
        this.lastIsEmpty = false;
    }

    public end(line: string) {
        if (this.commentLines > 0)
            throw 'Comment before block end';
        if (this.lastIsEmpty) {
            this.lines.pop();
            this.lastIsEmpty = false;
        }
        if (this.indentation.length < 4)
            throw 'Indentation too low';
        this.indentation = this.indentation.substr(0, this.indentation.length-4);
        this.lines.push(this.indentation + line);
        this.emptyLine();
    }

    public comment(line: string) {
        if (!line)
            return;
        if (this.commentLines === 0) {
            if (!this.lastIsEmpty)
                this.lines.push('');
            this.lines.push(this.indentation + '/**');
        }
        this.lines.push(this.indentation + ' * ' + line);
        this.commentLines++;
        this.lastIsEmpty = false;
    }

    public code(line: string) {
        if (this.commentLines > 0) {
            if (this.lastIsEmpty) {
                this.lines.pop();
                this.lastIsEmpty = false;
            }
            this.lines.push(this.indentation + ' */');
            this.commentLines = 0;
        }
        this.lines.push(this.indentation + line);
        this.lastIsEmpty = false;
    }

    public emptyLine() {
        if (!this.lastIsEmpty) {
            if (this.commentLines > 0)
                this.lines.push(this.indentation + ' *');
            else
                this.lines.push('');
            this.lastIsEmpty = true;
        }
    }

    public toString() {
        return this.lines.join('\n');
    }
}

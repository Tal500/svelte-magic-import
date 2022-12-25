// export enum SectionType {
//     Script,
//     Style,
//     Markup
// }

// TODO: Handle comments: '//', '/*' and '<!--' and ignoring the code section of them

type MatchedGroups<Options extends string = string, Must extends (Options | undefined) = undefined> =
    {[key in Options] : string | undefined} & (Must extends string ? {[key in Must] : string} : unknown);

type MatchedGroupsMust<Must extends string> = MatchedGroups<string, Must>;

export type ContextStartType = 'script' | 'style' | '<' | "'" | '"' | "`" | "(" | "{";

export type ContextStartData = { type: ContextStartType, position: number }

export const getLastContextData = (context: ContextStartData[]) => context.length ? context[context.length - 1] : undefined;

export function contextParserScript(code: string, start: number, end: number, context: ContextStartData[] = [],
    insideScriptTag: boolean = true) {
    
    // eslint-disable-next-line no-useless-escape
    const re = /(?<exit>\>)|(?<opening>[\(\{])|(?<closing>[\)\}])|(?<both>['"`])/gs;
    re.lastIndex = start;

    let match: RegExpExecArray | null;
    while ((match = re.exec(code)) && match.index < end) {
        const lastContextData = getLastContextData(context);

        const { exit, opening, closing, both } = match.groups as MatchedGroups;

        if (exit) {
            if (lastContextData?.type === 'script') {
                // TODO: Verify the syntax, that it ends up with `</script>`, otherwise return an error
                break;
            }
        } else if (opening) {
            // TODO
        } else if (closing) {
            // TODO
        } else if (both) {
            // TODO
        } else {
            throw "Internal error: No matched case";
        }
    }

    return context;
}

export function contextParserStyle(code: string, start: number, end: number, context: ContextStartData[] = []) {
    // TODO

    return context;
}

export function contextParserTagDef(code: string, start: number, end: number, context: ContextStartData[] = []) {
    // eslint-disable-next-line no-useless-escape
    const re = /^\s*((?<exit>\>)|(?<attr>\w[\w\d-_]*))/gs;
    re.lastIndex = start;

    let match: RegExpExecArray | null;
    while ((match = re.exec(code)) && match.index < end) {
        const { exit, attr } = match.groups as MatchedGroups;

        if (exit) {
            break;
        } else if (attr) {
            const valueRe = /^\w*=\w*(?<valueArea>.*)/
            valueRe.lastIndex = re.lastIndex;
            const valueAreaMatch = valueRe.exec(code);
            if (valueAreaMatch && match.index < end) {
                const { valueArea } = valueAreaMatch.groups as MatchedGroupsMust<'valueArea'>;
                
                if (valueArea.startsWith("'") || valueArea.startsWith('"')) {
                    const closingChar = valueArea[0];
                    let lastFoundClosingChar = 0;
                    while ((lastFoundClosingChar = valueArea.indexOf(closingChar, lastFoundClosingChar + 1)) >= 0) {
                        let escapeCount = 0;
                        while (valueArea[lastFoundClosingChar - escapeCount - 1] == '\\') {
                            ++escapeCount;
                        }
                        if (escapeCount % 2 === 1) {
                            break;// finally founded the correct closing
                        }
                    }
                    if (lastFoundClosingChar < 0) {// In the case we didn't found the correct closing
                        // TODO
                    }
                }

                // TODO: Handle starting with '{'
                // TODO: Warning! Svelte allows to put {} values inside the '"' and "'"! So need to pass it to script parsing.
            }
        } else {
            throw "Internal error: No matched case";
        }
    }

    return context;
}

export function contextParser(code: string, start: number, end: number, context: ContextStartData[] = []) {
    const re = /[<>]/gs;
    re.lastIndex = start;

    let match: RegExpExecArray | null;
    while ((match = re.exec(code)) && match.index < end) {
        if (code[match.index] === '>') {
            throw 'Error on parsing: Encountered > before a starting "<"';
        } else {// (the char is '<')
            context.push({ type: '<', position: match.index });
            contextParserTagDef(code, match.index + 1, end, context);
        }
    }

    return context;
}
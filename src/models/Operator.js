export const OPERATORS = {
    PLUS: "+",
    MINUS: "-",
    EQUAL: "=",
}

export function isAnOperator(string) {
    switch (string) {
        case OPERATORS.PLUS:
        case OPERATORS.MINUS:
        case OPERATORS.EQUAL:
            return true
        default:
            return false
    }
}
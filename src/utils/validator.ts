export const soliasDataValidations = {
    /**
     * Checks if a string is valid JSON.
     * @param str - String to check
     * @returns True if the string is valid JSON, false otherwise
     */
    isValidJSON: (str: string) => {
        try {
            JSON.parse(str);
            return true;
        } catch (e) {
            return false;
        }
    }
}
/**
 * @fileoverview if debugging set the DEBUG flag to true to console log all CTAT traffic
 */

const DEBUG = false;

if(DEBUG) {
    document.addEventListener(
        "tutorInitialized",
        e => {
            console.log("tutorInitialized", e)
            CTATCommShell.commShell.addGlobalEventListener({
                processCommShellEvent: function(e, m) {
                    console.log("processCommShellEvent e", e, "m", m);
                    if(!m) return;
                    console.log(`event: ${e}${m.getXMLString ? "\n\n" + m.getXMLString() : ""}`)
                }
            })
        }
    );
}

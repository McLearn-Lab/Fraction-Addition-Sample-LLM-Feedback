/**
 * @fileoverview generalized functionality for intercepting feedback messages and instead sending requests to openai and using that text
 */

/**
 * Generalized NLP feedback wrapper that picks the appropriate feedback component, passes the relevant data and triggers the NLP post request
 * @param {*} type 
 * @param {*} selection 
 * @param {*} action 
 * @param {*} expectedInput 
 * @param {*} studentInput 
 */
function nlpFeedback(type, selection, action, expectedInput, studentInput) {
    let nlpElt=CTATShellTools.findComponent(type + "NLP");
    if(nlpElt && nlpElt[0]) {
        nlpElt[0].setText([selection, action, expectedInput, studentInput]);
        nlpElt[0].processAction();

    }
}

/**
 * Core features that make the NLP feedback work:
 * Intercept feedback messages, triggering NLP requests
 * When those NLP requests come back, emit the feedback 
 */
document.addEventListener(
    "tutorInitialized",
    e => {
        
        //Listen on associated rules for feedback messages and send NLP requests every time

        CTATCommShell.commShell.addGlobalEventListener({
            processCommShellEvent: function(e, m) {
                //filter out associated rules
                if(!m || !/AssociatedRules/.test(e)) return;
                console.log("associated rule:\n\n", m.getXMLString());
                let $xml = $($.parseXML(m.getXMLString()));

                //make sure student is actor and their action matches a link
                if(!/Student/.test($xml.find("Actor").text()) ||
                   /NO-MODEL/.test($xml.find("TraceOutcome").text())) 
                    return;

                nlpFeedback(
                    //type of feedback, with spaces removed and first letter made lowercase to match CTATNLPInput elements' camelCase convention id's. 
                    $xml.find("TraceOutcome").text().charAt(0).toLowerCase().replace(/\s+/g,'') + $xml.find("TraceOutcome").text().replace(/\s+/g,'').slice(1),
                    $xml.find("Selection").text(), 
                    $xml.find("Action").text(),
                    $xml.find("Input").text(),//expected answer
                    $xml.find("StudentInput").text()//actual answer
                );
            }
        });

        
        //When openAI gets back for any type of feedback, emit the feedback 
        CTATCommShell.commShell.addGlobalEventListener({
            processCommShellEvent: function(e, m) {
                if(!m) return;
                //one of the three CTAT NLP elements
                else if(/CorrectAction/.test(e) &&
                       (/buggyActionNLP/.test(m.getSelection()) ||
                        /hintActionNLP/.test(m.getSelection()) ||
                        /correctActionNLP/.test(m.getSelection())))
                    //parsing of response here is necessary for openAI api, might look different for other services
                    CTATCommShell.commShell.showFeedback(JSON.parse(m.getInput()).choices[0].message.content);
            }
        });
    }
);
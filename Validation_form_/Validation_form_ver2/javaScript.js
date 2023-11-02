function Validator(formSelector) {

    // <1> Get parent Element
    function getParent(element,selector) {
        while(element.parentElement) {
            if(element.parentElement.matches(selector)){
                return element.parentElement
            }
            element = element.parentElement
        }
    }

    // <2> Object content all rules
    var formRules = {}

    // <3> All functions 
    var validatorRules = {
        required: function(value) {
            return value ? undefined : 'Vui lòng nhập trường này'
        },
        email: function(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regex.test(value) ? undefined : 'Vui lòng nhập trường này'
        },
        min: function(min) {
            
            return function(value) {
                return value.length >= min ? undefined : `Vui lòng nhập ít nhất ${min} ký tự` 
            }
        },
    }

    // <4> Get element in DOM form 'formElement'
    var formElement = document.querySelector(formSelector);

    // <5> Only processed when formElement is valid
    if(formElement) {
        var inputs = formElement.querySelectorAll('[name][rule]')

        for(var input of inputs) { 
            var rules = input.getAttribute('rule').split('|')
            for(var rule of rules) {
                var ruleInfor
                var isRuleHasValur = rule.includes(':')
                if(isRuleHasValur) {
                    ruleInfor = rule.split(':')
                    rule = ruleInfor[0]
                }

                var ruleFuction = validatorRules[rule]
                if(isRuleHasValur) {
                    ruleFuction = ruleFuction(ruleInfor[1])
                }


                if(Array.isArray(formRules[input.name])) {
                    formRules[input.name].push(ruleFuction)
                }else {
                    formRules[input.name] = [ruleFuction]
                }
            }
            // Listen events
            input.onblur = handleValidate
            input.oninput = handleClearError

        }

        // Function to handle
        function handleValidate(event) {
            var rules = formRules[event.target.name]
            var errorMessage

            for(var rule of rules) {
                errorMessage = rule(event.target.value);
                if(errorMessage) break
            }

            if(errorMessage) {
                var formGroup = getParent(event.target, '.form-group')
                if(formGroup) {
                    formGroup.classList.add('invalid')
                    var formMessage = formGroup.querySelector('.form-message')
                    if(formMessage) {
                        formMessage.innerHTML = errorMessage
                    }
                }
            }
             return !errorMessage
        }

        function handleClearError(event) {
            var formGroup = getParent(event.target, '.form-group')
                if(formGroup.classList.contains('invalid')) {
                    formGroup.classList.remove('invalid')
                    
                    var formMessage = formGroup.querySelector('.form-message')
                    if(formMessage) {
                        formMessage.innerText = ''
                    }

            }
        }

        formElement.onsubmit = function(event) {
            event.preventDefault()
            var isValied = true;

            for(var input of inputs) {
               if( !handleValidate({ target: input})){
                isValied = false;
               }
            }

            if(isValied) {
                formElement.submit()
            }
        }
    }

    
}
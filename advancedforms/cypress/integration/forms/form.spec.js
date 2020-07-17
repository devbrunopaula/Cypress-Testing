describe('Test Form', () => {
   
        it.only('Visting The App', () => {
            cy.visit('/')
        })
   
        it('can type a text for a value', () => {
            cy.get('input[name="name"]')
              .type('Bruno')
              .should('have.value', 'Bruno')
          })
          
          it('Get Email and type an Email', () => {
              cy.get('input[name="email"]')
                .type('bruno@gmail.com')
          })

          it('Get Password and type a password', () => {
            cy.get('input[name="password"]')
              .type('pass123')
          })

          it('will check to see if a user can check the terms of service box', () => {
            //   cy.get('#terms').click()
              cy.get('#terms')
              .check().should('be.checked')
              
          })
        
          it.only('Submit Button', () => {
            cy.get('#formSubmitBtn')
            .type('submit')  
          })

          it('.submit() - submit a form', () => {
           
            cy.get('#contactForm').submit()
            
        
          })
})


function addNewWEField(){
    let newNode = document.createElement("textarea");
    newNode.classList.add("form-control");
    newNode.classList.add("weField");
    newNode.classList.add("mt-2");
    newNode.setAttribute("rows",3);
    newNode.setAttribute('placeholder','Enter here')

    let weOb = document.getElementById("we");
    let  weAddButtonOb = document.getElementsByClassName("weAddButton")[0];

    weOb.insertBefore(newNode, weAddButtonOb);
}

function addNewAQField(){
    let newNode = document.createElement("textarea");
    newNode.classList.add("form-control");
    newNode.classList.add("aqField");
    newNode.classList.add("mt-2");
    newNode.setAttribute("rows",3);
    newNode.setAttribute('placeholder','Enter here');

    let aqOb = document.getElementById("aq");
    let aqAddButtonOb = document.getElementsByClassName("aqAddButton")[0];

    aqOb.insertBefore(newNode, aqAddButtonOb);
}

//generating resume

function generateResume(){
    //fetching (value) name from namefield and setting it to the nameT1 and nameT2
    //long method
    let nameField = document.getElementById("nameField").value;
    let nameT1 = document.getElementById("nameT1");
    nameT1.innerHTML = nameField;       //changing name of nameT1 using nameField

    document.getElementById("nameT2").innerHTML = nameField; //shortcut method
        //contacts
     document.getElementById("contactT").innerHTML = `<i class="fas fa-phone"></i> ${document.getElementById("contactField").value}`;
    //address
     document.getElementById("addressT").innerHTML = `<i class="fas fa-map-marker-alt"></i> ${document.getElementById("addressField").value}`;
    //email
     document.getElementById("emailT").innerHTML = `<i class="fas fa-envelope"></i> ${document.getElementById("emailField").value}`;
    //linkedin
     document.getElementById("linkedT").innerHTML = `<i class="fab fa-linkedin"></i> ${document.getElementById("linkedinField").value}`;
     //github
     document.getElementById("GithubT").innerHTML = `<i class="fab fa-github"></i> ${document.getElementById("githubField").value}`;

    //objective
    document.getElementById("objectiveT").innerHTML = document.getElementById("ObjectiveField").value;

    //Work Experience
    let wes = document.getElementsByClassName("weField");
    let str = "";
    //for of loop
    for(let e of wes){
        str = str + `<li>${e.value}</li>`;
    }
    document.getElementById("weT").innerHTML = str;

    //Academic Qualification
    let aqs = document.getElementsByClassName("aqField");
    let str1 = "";
    //for of loop
    for(let e of aqs){
        str1 = str1 + `<li>${e.value}</li>`;
    }
    document.getElementById("aqT").innerHTML = str1;

    //code for setting image
    let file = document.getElementById("imgField").files[0];
    
    if(file) {
        console.log(file);
        let reader = new FileReader();
        reader.readAsDataURL(file);
        console.log(reader.result);
        
        //set image to template
        reader.onloadend = function(){
            document.getElementById("imgTemplate").src = reader.result;
        }
    }

    document.getElementById("resume-form").style.display="none";
    document.getElementById("resume-template").style.display="block";
}

// AI Content Suggestions
async function getAISuggestion(type, input) {
    try {
        // Using a free AI service (you can replace with OpenAI or other services)
        const response = await fetch('https://api.cohere.ai/v1/generate', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getCohereAPIKey()}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'command',
                prompt: generatePrompt(type, input),
                max_tokens: 200,
                temperature: 0.7,
                k: 0,
                stop_sequences: [],
                return_likelihoods: 'NONE'
            })
        });
        
        if (!response.ok) {
            throw new Error('AI service not available');
        }
        
        const data = await response.json();
        return data.generations[0].text.trim();
    } catch (error) {
        console.log('AI suggestion failed, using fallback:', error);
        return getFallbackSuggestion(type, input);
    }
}

function generatePrompt(type, input) {
    const prompts = {
        'objective': `Write a professional and compelling career objective for a resume. Job title: ${input.jobTitle || 'professional'}. Experience level: ${input.experience || 'entry-level'}. Industry: ${input.industry || 'general'}. Make it specific, professional, and 2-3 sentences long.`,
        'workExperience': `Rewrite this work experience in professional resume language with action verbs and quantifiable achievements: "${input.text}". Make it 1-2 bullet points that are impactful and professional.`,
        'skills': `Suggest 5-8 relevant technical and soft skills for a ${input.jobTitle || 'professional'} position in ${input.industry || 'technology'} industry. Format as a simple list.`,
        'description': `Enhance this description to be more professional and impactful for a resume: "${input.text}". Make it 1-2 sentences with action verbs and specific details.`
    };
    return prompts[type] || prompts['description'];
}

function getFallbackSuggestion(type, input) {
    const fallbacks = {
        'objective': {
            'entry-level': 'Seeking an entry-level position where I can apply my knowledge and skills while contributing to organizational growth and gaining valuable experience.',
            'mid-level': 'Experienced professional seeking a challenging role where I can leverage my expertise to drive results and contribute to company success.',
            'senior': 'Senior professional with proven track record seeking leadership opportunities to mentor teams and deliver strategic business outcomes.'
        },
        'workExperience': '• Led and managed key projects resulting in measurable improvements\n• Collaborated with cross-functional teams to achieve project objectives',
        'skills': '• Problem Solving\n• Team Leadership\n• Technical Analysis\n• Communication\n• Project Management\n• Strategic Planning\n• Data Analysis\n• Stakeholder Management',
        'description': 'Successfully managed and delivered projects while collaborating with diverse teams to achieve organizational goals.'
    };
    
    if (type === 'objective' && input.experience) {
        return fallbacks.objective[input.experience] || fallbacks.objective['mid-level'];
    }
    
    return fallbacks[type] || fallbacks.description;
}

function getCohereAPIKey() {
    // You can replace this with your actual API key
    // For now, using a placeholder - users can add their own key
    return localStorage.getItem('cohere_api_key') || 'GET YOUR API KEY HERE';
}

// Enhanced form with AI suggestions
function addAISuggestionButtons() {
    // Add AI suggestion button for objective
    const objectiveField = document.getElementById("ObjectiveField");
    const objectiveContainer = objectiveField.parentElement;
    
    if (!document.getElementById('aiObjectiveBtn')) {
        const aiObjectiveBtn = document.createElement('button');
        aiObjectiveBtn.id = 'aiObjectiveBtn';
        aiObjectiveBtn.className = 'btn btn-outline-primary btn-sm mt-2';
        aiObjectiveBtn.innerHTML = '🤖 Get AI Suggestion';
        aiObjectiveBtn.onclick = () => getObjectiveSuggestion();
        objectiveContainer.appendChild(aiObjectiveBtn);
    }
    
    // Add AI suggestion button for work experience
    const weContainer = document.getElementById('we');
    if (!document.getElementById('aiWEBtn')) {
        const aiWEBtn = document.createElement('button');
        aiWEBtn.id = 'aiWEBtn';
        aiWEBtn.className = 'btn btn-outline-primary btn-sm mt-2';
        aiWEBtn.innerHTML = '🤖 Enhance with AI';
        aiWEBtn.onclick = () => enhanceWorkExperience();
        weContainer.appendChild(aiWEBtn);
    }
}

async function getObjectiveSuggestion() {
    const jobTitle = document.getElementById('nameField').value || 'professional';
    const experience = document.getElementById('experienceLevel')?.value || 'mid-level';
    const industry = document.getElementById('industryField')?.value || 'technology';
    
    const btn = document.getElementById('aiObjectiveBtn');
    btn.innerHTML = '🤖 Generating...';
    btn.disabled = true;
    
    try {
        const suggestion = await getAISuggestion('objective', { jobTitle, experience, industry });
        document.getElementById('ObjectiveField').value = suggestion;
        showNotification('AI suggestion applied! ✨', 'success');
    } catch (error) {
        showNotification('AI suggestion failed. Using fallback.', 'warning');
    } finally {
        btn.innerHTML = '🤖 Get AI Suggestion';
        btn.disabled = false;
    }
}

async function enhanceWorkExperience() {
    const weFields = document.getElementsByClassName('weField');
    if (weFields.length === 0) return;
    
    for (let field of weFields) {
        if (field.value.trim()) {
            const btn = document.getElementById('aiWEBtn');
            btn.innerHTML = '🤖 Enhancing...';
            btn.disabled = true;
            
            try {
                const enhanced = await getAISuggestion('workExperience', { text: field.value });
                field.value = enhanced;
            } catch (error) {
                console.log('Enhancement failed for field');
            }
        }
    }
    
    const btn = document.getElementById('aiWEBtn');
    btn.innerHTML = '🤖 Enhance with AI';
    btn.disabled = false;
    showNotification('Work experience enhanced with AI! ✨', 'success');
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'success' ? 'success' : 'warning'} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// download resume as PDF
function downloadResume(){
    // Get the resume template element
    const resumeElement = document.getElementById("resume-template");
    
    // Create a clone of the resume element to avoid modifying the original
    const resumeClone = resumeElement.cloneNode(true);
    
    // Remove the buttons container from the clone
    const buttonsContainer = resumeClone.querySelector('.container.mb-2.text-center');
    if (buttonsContainer) {
        buttonsContainer.remove();
    }
    
    // Configure PDF options optimized for A4 format
    const opt = {
        margin: [0.5, 0.5, 0.5, 0.5], // [top, right, bottom, left] margins in inches
        filename: 'resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2,
            useCORS: true,
            allowTaint: true,
            letterRendering: true
        },
        jsPDF: { 
            unit: 'in', 
            format: 'a4', 
            orientation: 'portrait',
            compress: true
        },
        pagebreak: { mode: 'avoid-all' }
    };
    
    // Use html2pdf library to generate and download PDF from the cleaned clone
    html2pdf().set(opt).from(resumeClone).save();
}

// Initialize AI suggestion buttons when page loads
document.addEventListener('DOMContentLoaded', function() {
    addAISuggestionButtons();
});




pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min.js";

let outputData = "";


async function parsePDF(file) {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((i) => i.str).join(" ");
  }
  return text;
}


async function parseResume() {
  const file = document.getElementById("resumeFile").files[0];
  if (!file) return alert("Please upload a resume first!");
  const progressContainer = document.getElementById("progressContainer");
  const progressBar = document.getElementById("progressBar");

  progressContainer.style.display = "block";
  progressBar.style.width = "0%";

  let progress = 0;
  const progressInterval = setInterval(() => {
    if (progress < 85) {
      progress += 5;
      progressBar.style.width = progress + "%";
    }
  }, 200);

  const text =
    file.type === "application/pdf" ? await parsePDF(file) : await file.text();
  /* ---------- FINISH PROGRESS ---------- */
  clearInterval(progressInterval);
  progressBar.style.width = "100%";

  setTimeout(() => {
    progressContainer.style.display = "none";
    progressBar.style.width = "0%";
  }, 800);

  /* BASIC DETAILS */
  const name = text.match(/([A-Z][a-z]+(?: [A-Z][a-z]+)+)/)?.[0] || "Not Found";

  const email =
    text.match(/[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/)?.[0] || "Not Found";

  const phone = text.match(/(\+?\d{1,4}[\s-]?)?\d{10}/)?.[0] || "Not Found";

  /* SKILLS */
  const skillsList = [
    "HTML",
    "CSS",
    "JavaScript",
    "Java",
    "Python",
    "C",
    "C++",
    "React",
    "Node",
    "SQL",
    "MongoDB",
    "Excel",
  ];

  const skills =
    skillsList
      .filter((skill) => text.toLowerCase().includes(skill.toLowerCase()))
      .join(", ") || "Not Mentioned";

  /* EDUCATION */
  const education =
    text
      .match(
        /(B\.?Tech|BCA|B\.?Sc|MCA|MBA|Diploma|Bachelor|Master|10th|12th)/gi
      )
      ?.join(", ") || "Not Found";

  /* EXPERIENCE */
  const experience = text.match(
    /(experience|internship|worked at|company|organization|project)/gi
  )
    ? "Experience / Internship details found"
    : "No experience mentioned";

  /* ACHIEVEMENTS / CERTIFICATIONS */
  const achievements = text.match(
    /(achievement|certification|certified|award|won|hackathon)/gi
  )
    ? "Achievements / Certifications mentioned"
    : "No achievements found";

  outputData = `
Name: ${name}
Email: ${email}
Phone: ${phone}
Education: ${education}
Skills: ${skills}
Experience: ${experience}
Achievements: ${achievements}
  `;

  /* SINGLE CARD OUTPUT */
  document.getElementById("outputCards").innerHTML = `
    <div class="result-card show">
      <h3>📄 Extracted Resume Details</h3>

      <p><strong>👤 Name:</strong> ${name}</p>
      <p><strong>📧 Email:</strong> ${email}</p>
      <p><strong>📞 Phone:</strong> ${phone}</p>

      <hr>

      <p><strong>🎓 Education:</strong><br>${education}</p>
      <p><strong>🛠 Skills:</strong><br>${skills}</p>
      <p><strong>💼 Work Experience:</strong><br>${experience}</p>
      <p><strong>🏆 Achievements:</strong><br>${achievements}</p>
    </div>
  `;
}

/* ---------- DOWNLOAD ---------- */
function downloadPDF() {
  if (!outputData) return alert("Extract first!");
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text(JSON.stringify(outputData, null, 2), 10, 10);
  doc.save("resume-output.pdf");
}

/* ---------- LOGIN / SIGNUP ---------- */
function signup() {
  localStorage.setItem(
    "user",
    JSON.stringify({
      email: signupEmail.value,
      pass: signupPass.value,
    })
  );
  alert("Signup successful");
  closeModal();
}

function login() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.email === loginEmail.value && user?.pass === loginPass.value) {
    alert("Login successful");
    closeModal();
  } else alert("Invalid credentials");
}

/* ---------- MODAL ---------- */
function openModal(id) {
  document.getElementById(id).style.display = "block";
}
function closeModal() {
  document
    .querySelectorAll(".modal")
    .forEach((m) => (m.style.display = "none"));
}

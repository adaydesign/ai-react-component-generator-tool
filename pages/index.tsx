import { useState, useRef } from "react"
import { Toaster, toast } from "react-hot-toast"
import { ClipLoader } from "react-spinners"

// Define a default function component called Home
export default function Home() {
  const [userToken, setUserToken] = useState<string>("")
  // Define three state variables for the original text, paraphrased text, and paraphrase mode
  const [originalText, setOriginalText] = useState<string>("")
  const [paraphrasedText, setParaphrasedText] = useState<string>("")
  const [paraphraseMode, setParaphraseMode] = useState<string>("CSS")

  // Define a ref for the text area element
  const textAreaRef = useRef(null)

  // Define a state variable for the loading state of the paraphrasing operation
  const [loading, setLoading] = useState<boolean>(false)

  // Construct a prompt string based on the original text and paraphrase mode
  //const prompt = `Paraphrase "${originalText}" using ${paraphraseMode} mode. Do not add any additional word.`;
  const prompt = `write code program with react component for "${originalText}" using ${paraphraseMode} as UI library. Show only code.`

  // Define an async function to handle the paraphrasing operation
  const handleParaphrase = async (e: React.FormEvent) => {
    // Prevent form submission if original text is empty
    if (!originalText) {
      toast.error("Enter text to paraphrase!")
      return
    }

    if (!userToken) {
      toast.error("Enter your API Token Key")
      return
    }

    // Set the loading state and reset the paraphrased text
    setLoading(true)

    // Send a POST request to the "/api/paraphrase" API endpoint with the prompt in the request body
    const response = await fetch("/api/paraphrase", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        userToken,
      }),
    })

    // Parse the response as JSON
    const data = await response.json()

    // Set the paraphrased text to the first choice's message content in the response
    // console.log(data)
    if (data.choices && data.choices?.length > 0) {
      setParaphrasedText(data.choices[0].message.content)
    } else if (data.error) {
      toast.error(data.error?.message)
    } else {
      toast.error("nothing...")
    }

    // Reset the loading state
    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <main className="max-w-4xl w-full bg-white rounded-lg shadow-md p-6 mb-4">
        <h1 className="text-4xl font-bold mb-4">AI React Component Tool</h1>
        <div className="mb-4">
          <p className="text-sm mb-2">
          Please provide your OpenAI API Key. We only store this key locally and never send it to our servers. - {" "}
            <a
              href="https://platform.openai.com/account/api-keys"
              target="_blank"
            >
              https://platform.openai.com/account/api-keys
            </a>
          </p>
          <input
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-2 sm:text-lg border-gray-300 rounded-md border"
            value={userToken}
            onChange={(e) => setUserToken(e.target.value)}
            placeholder="Enter you API Key"
          />
        </div>
        <p className="text-sm mb-2">
          Enter the text you want to create a react component below, select a ui
          library, and click on the [Get Code] button to see the results!
        </p>
        <div className="mb-4">
          <textarea
            onChange={(e) => setOriginalText(e.target.value)}
            value={originalText}
            rows={6}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full h-96 p-4 sm:text-lg border-gray-300 rounded-md border"
            placeholder="Enter text to create a react component"
          ></textarea>
          <div className="mb-4 flex items-center justify-between w-full">
            <div className="mr-2"></div>
            <span className="text-sm font-bold">
              {originalText &&
                originalText.trim().split(/\s+/).length + ` word(s)`}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <select
            value={paraphraseMode}
            onChange={(e) => setParaphraseMode(e.target.value)}
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="CSS">CSS</option>
            <option value="Tailwind CSS">Tailwind CSS</option>
            <option value="MUI">MUI</option>
            <option value="AntDesign">AntDesign</option>
            <option value="ChakraUI">ChakraUI</option>
            <option value="React Bootstrap">React Bootstrap</option>
          </select>
        </div>
        <div className="mb-4">
          <button
            onClick={handleParaphrase}
            className="inline-block px-4 py-2 leading-none border rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:bg-blue-700"
          >
            Get Code
          </button>
        </div>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 3000 }}
        />

        {loading && (
          <div className="loader-overlay">
            <ClipLoader size={60} color={"#ffffff"} loading={loading} />
          </div>
        )}

        {paraphrasedText && (
          <div className="flex flex-col items-center justify-center w-full">
            <h2 className="text-xl font-bold mb-2 flex items-center">
              React Component Code..{" "}
              <button
                title="Copy"
                onClick={() => {
                  navigator.clipboard.writeText(paraphrasedText)
                  toast.success("Copied to clipboard")
                }}
                className="bg-blue-600 hover:bg-blue-800 text-white text-lg h-8 w-7 rounded-full ml-3 focus:outline-none cursor-pointer"
              >
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <rect x="8" y="8" width="12" height="12" rx="2" />
                  <path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2" />
                </svg>
              </button>
            </h2>

            <p
              className="p-4 sm:text-lg border-gray-300 rounded-md bg-gray-800 text-white mt-2 sm:mt-0 w-full"
              style={{ whiteSpace: "pre-wrap" }}
            >
              {paraphrasedText}
            </p>
          </div>
        )}
      </main>
      <footer className="text-gray-600 text-center text-md mt-2">
        Built with Next.js, Tailwind CSS, and OpenAI |{" "}
        <a
          href="https://github.com/adaydesign/ai-react-component-generator-tool"
          target="_blank"
        >
          Github
        </a>
      </footer>
    </div>
  )
}

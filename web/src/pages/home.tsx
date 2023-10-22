import { useState } from 'react'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import remarkGfm from 'remark-gfm'

export default function Home() {
  const [showChat, setShowChat] = useState<boolean>(false)
  const [candidate, setCandidate] = useState<string>()
  const [messages, setMessages] = useState<{ role: string, content: string }[]>([])

  return <div className="container mx-auto py-6">
    <div>
      {!showChat || !candidate ? <div className="mx-auto max-w-2xl">
        <div>
          <div>
            <img src="/logo.png" className="w-full max-w-[236px] mx-auto" alt="" />
          </div>
          <div className="card bg-base-100 shadow-inner mt-8">
            <div className="card-body prose">
              <h2 className="card-title font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path d="M12 9v4" />
                  <path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0z" />
                  <path d="M12 16h.01" />
                </svg>
                Perhatian!
              </h2>
              <p className="mb-0">
                Aplikasi ini dibuat untuk membantu masyarakat dalam mengetahui visi misi dari para calon presiden dan wakil presiden Indonesia tahun 2024. Semua data diambil dari:
              </p>
              <ul className="my-0">
                <li>
                  <a href="https://mmc.tirto.id/documents/2023/10/20/1241-amin-visi-misi-program.pdf?x=2676" target="_blank" rel="noopener noreferrer">
                    mmc.tirto.id/.../1241-amin-visi-misi-program.pdf
                  </a>
                </li>
                <li>
                  <a href="https://visimisiganjarmahfud.id/assets/docs/Visi-Misi-Ganjar-Pranowo-Mahfud-MD-v2.pdf" target="_blank" rel="noopener noreferrer">
                    visimisiganjarmahfud.id/.../Visi-Misi-Ganjar-Pranowo-Mahfud-MD-v2.pdf
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-4 text-center flex gap-4 justify-center">
            <div className="form-control">
              <select className="select select-bordered" onChange={e => setCandidate(e.target.value)}>
                <option disabled selected>Pilih Capres</option>
                <option value="amin">AMIN</option>
                <option value="gama">GAMA</option>
              </select>
            </div>
            <div>
              <button className="btn btn-primary btn-neutral" onClick={() => setShowChat(true)}>
                Mulai Tanyakan!
              </button>
            </div>
          </div>
        </div>
      </div> : <div className="mx-auto max-w-2xl">
        <div className="hidden">
          <div className="chat chat-start">
            <div className="chat-bubble">It's over Anakin, <br/>I have the high ground.</div>
          </div>
          <div className="chat chat-end">
            <div className="chat-bubble bg-base-200 text-base-content">You underestimate my power!</div>
          </div>
        </div>
        <div className="card shadow-md lg:card-normal card-compact">
          <div className="card-body">
            <div className="flex gap-4 items-center">
              <div>
                <img src={`/${candidate}.png`} className="mask mask-circle w-full max-w-[52px]" alt="" />
              </div>
              <div className="flex flex-col grow">
                <h3 className="text-xl font-bold">{candidate === 'amin' ? 'AMIN' : candidate === 'gama' ? 'GAMA' : ''}</h3>
                <p className="text-sm text-gray-400">Tanyakan visi misinya.</p>
              </div>
              <div>
                <button onClick={() => setMessages([])} className="btn btn-ghost">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
                    <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="card overflow-y-auto lg:min-h-[calc(100vh-350px)] min-h-[calc(100vh-280px)]">
          <div className="card-body">
            {messages.map((message, index) => <div key={index} className={`chat chat-${message.role !== 'user' ? 'start' : 'end'}`}>
              <div className={`chat-bubble prose max-w-full ${message.role !== 'user' ? 'bg-neutral' : 'bg-base-200 text-base-content'}`}>
                <ReactMarkdown
                  children={message.content.trim()}
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '')
                      return !inline ? (
                        <SyntaxHighlighter
                          children={String(children).replace(/\n$/, '')}
                          style={dracula as any}
                          language={match?.[1]}
                          PreTag="div"
                          {...props}
                        />
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      )
                    }
                  }} />
              </div>
            </div>)}
          </div>
        </div>
        <div className="card shadow-md lg:card-normal card-compact">
          <div className="card-body">
            <form onSubmit={async e => {
              e.preventDefault()
              const data = Object.fromEntries(new FormData(e.target as HTMLFormElement))
              const msgs = [...messages, { role: 'user', content: data.content }]
              const resp = await fetch(`https://tanyacapres-api.appledore.dev/prompt/${candidate}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  messages: msgs
                })
              })
              console.log(resp)
            }}>
              <div className="flex gap-2">
                <div className="grow">
                  <div className="form-control">
                    <input type="text" required name="content" className="input input-bordered" placeholder="Tanya apa saja..."  />
                  </div>
                </div>
                <div>
                  <button type="submit" className="btn btn-ghost btn-outline border-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                      <path d="M10 14l11 -11" />
                      <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" />
                    </svg>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>}
    </div>
  </div>
}
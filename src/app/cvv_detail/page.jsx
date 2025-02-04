"use client"

import { motion } from "framer-motion"
import { Shield, Copy, AlertTriangle, Activity, Target, Calendar, Building2, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "react-hot-toast"
import { useEffect, useState } from "react"
import { TableCell, TableRow } from "@/components/ui/table"


const sampleData = [
    {
        baseScore: 5.9,
        baseSeverity: "MEDIUM",
        cvssVector: "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:N/A:N",
        exploitabilityScore: 2.2,
        impactScore: 3.6,
        scoreSource: "NIST",
        firstSeen: "2023-12-01",
    },
    {
        baseScore: 7.4,
        baseSeverity: "HIGH",
        cvssVector: "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:N",
        exploitabilityScore: 2.2,
        impactScore: 5.2,
        scoreSource: "Red Hat, Inc.",
        firstSeen: "2023-12-01",
    },
]

export default function page() {
    const [isLoading, setIsLoading] = useState(false);
    const cvv_id = localStorage.getItem('cvv_id');
    const cvv_link = localStorage.getItem('cvv_link');
    const [data, setData] = useState(null);
    const [copiedIndex, setCopiedIndex] = useState(null)

    const copyToClipboard = (text, index) => {
        navigator.clipboard.writeText(text)
        setCopiedIndex(index)
        toast.success("CVSS vector copied to clipboard")
        setTimeout(() => setCopiedIndex(null), 2000)
    }

    const getSeverityColor = (severity) => {
        switch (severity.toUpperCase()) {
            case "HIGH":
                return "text-red-400 border-red-400"
            case "MEDIUM":
                return "text-yellow-400 border-yellow-400"
            case "LOW":
                return "text-green-400 border-green-400"
            default:
                return "text-blue-400 border-blue-400"
        }
    }

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/cvvid?link=${cvv_link}`, {
                method: "GET",
            });
            const data = await res.json();
            const evenFootData = data.foot.filter((_, index) => index % 2 === 0);
            console.log(evenFootData);
            setData(evenFootData);
        } catch (err) {
            toast.error(`Error while searching for software: ` + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [])

    const getScoreColor = (score) => {
        if (score >= 7) return "bg-red-500/20 text-red-400"
        if (score >= 4) return "bg-yellow-500/20 text-yellow-400"
        return "bg-green-500/20 text-green-400"
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-zinc-900 py-12 px-4">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute left-1/4 top-1/4 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
                <div className="absolute right-1/4 bottom-1/4 w-96 h-96 bg-purple-500/10 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-12">
                    <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
                        <Shield className="h-16 w-16 mx-auto text-blue-400 mb-4" />
                        <h1 className="text-4xl font-bold text-white mb-4">CVSS Scores</h1>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">{cvv_id} Vulnerability Assessment</p>
                    </motion.div>
                </div>

                <div className="grid gap-6">
                    {isLoading ? (
                        <TableRow className="flex justify-center items-center">
                            <TableCell colSpan={5} className="h-32 text-center">
                                <div className="flex flex-col items-center justify-center text-gray-500">
                                    <Loader2 className="h-8 w-8 animate-spin mb-2" />
                                    <p>Searching for results...</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : <>
                        {data?.map((score, index) => (
                            <motion.div
                                key={index}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Card className="bg-black/40 border border-blue-500/20 backdrop-blur-sm overflow-hidden hover:border-blue-500/40 transition-all duration-300">
                                    <CardHeader className="border-b border-blue-500/20">
                                        <div className="flex items-center justify-between  flex-wrap gap-4">
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className={`px-4 py-2 rounded-lg font-mono text-2xl font-bold ${getScoreColor(score[0])}`}
                                                >
                                                    {score[0]}
                                                </div>
                                                <Badge variant="outline" className={`text-sm ${getSeverityColor(score[1])}`}>
                                                    <AlertTriangle className="w-4 h-4 mr-1" />
                                                    {score[1]}
                                                </Badge>
                                            </div>
                                            <div className="flex gap-3">
                                                <Badge variant="outline" className="border-emerald-500 text-emerald-400 text-sm">
                                                    <Activity className="w-4 h-4 mr-1" />
                                                    Exploitability: {score[3]}
                                                </Badge>
                                                <Badge variant="outline" className="border-purple-500 text-purple-400 text-sm">
                                                    <Target className="w-4 h-4 mr-1" />
                                                    Impact: {score[4]}
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between gap-4 bg-black/20 p-3 rounded-lg">
                                                <code className="text-md lg:text-lg text-gray-300 font-mono break-all">{score[2]}</code>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => copyToClipboard(score[2], index)}
                                                    className="shrink-0"
                                                >
                                                    <Copy className={`h-4 w-4 ${copiedIndex === index ? "text-green-400" : "text-gray-400"}`} />
                                                </Button>
                                            </div>
                                            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                                <div className="flex items-center gap-2">
                                                    <Building2 className="h-4 w-4 text-blue-400" />
                                                    <span>Source: {score[5]}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-blue-400" />
                                                    <span>First Seen: {score[6]}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </>
                    }
                </div>
            </div>
        </div>
    )
}
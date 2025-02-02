"use client"
import { motion } from "framer-motion"
import { AlertTriangle, Calendar, Shield, ArrowUpRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "../context/store"
import Link from "next/link"


export default function page() {
    const { data, link } = useAuth();
    if (!data) {
        return <div>loading...</div>
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-zinc-900 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
                        <Shield className="h-16 w-16 mx-auto text-indigo-500 mb-4" />
                        <h1 className="text-4xl font-bold text-white mb-4">Vulnerability Reports</h1>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            Latest security vulnerabilities and their impact assessments
                        </p>
                    </motion.div>
                </div>
                <div className="grid gap-6">
                    {data?.map((vuln, index) => (
                        <motion.div
                            key={index}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className="bg-black/40 border border-indigo-500/20 backdrop-blur-sm overflow-hidden">
                                <CardHeader className="border-b border-indigo-500/20">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                                                <Link href={link} target="_blank" rel="noopener noreferrer">
                                                    {vuln.firstDiv[0]}
                                                </Link>
                                            </CardTitle>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Badge
                                                variant="outline"
                                                className={`px-3 py-1 text-sm lg:text-md ${vuln.secondDiv[0] >= 7
                                                        ? "border-red-500 text-red-400"
                                                        : vuln.secondDiv[0] >= 4
                                                            ? "border-yellow-500 text-yellow-400"
                                                            : "border-green-500 text-green-400"
                                                    }`}
                                            >
                                                <AlertTriangle className="w-4 h-4 mr-1" />
                                                CVSS {vuln.secondDiv[0]}
                                            </Badge>
                                            <Badge variant="outline" className="border-blue-500 text-blue-400 text-sm lg:text-md px-3 py-1">
                                                EPSS {vuln.secondDiv[1]}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <p className="text-gray-300 mb-6 leading-relaxed text-sm lg:text-lg">{vuln.firstDiv[1]}</p>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-indigo-400 text-sm lg:text-lg" />
                                            <span className="text-sm lg:text-lg">Published: {vuln.secondDiv[2]}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm lg:text-lg">
                                            <Calendar className="h-4 w-4 text-indigo-400" />
                                            <span className="text-sm lg:text-lg">Updated: {vuln.secondDiv[3]}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm lg:text-lg">
                                            <Shield className="h-4 w-4 text-indigo-400" />
                                            <span className="text-sm lg:text-lg">Source: {vuln.firstDiv[2]}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}


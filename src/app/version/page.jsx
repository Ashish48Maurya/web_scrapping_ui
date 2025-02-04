"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp, ExternalLink, Loader2 } from "lucide-react"
import Link from "next/link"
import toast from "react-hot-toast"


const initialData = [
    {
        version: "0.10.29",
        language: "-",
        update: "-",
        edition: "-",
        targetPlatform: "-",
        vulnerabilities: 1,
        detailsLink: "#",
    },
    {
        version: "0.10.28",
        language: "-",
        update: "-",
        edition: "-",
        targetPlatform: "-",
        vulnerabilities: 1,
        detailsLink: "#",
    },
    {
        version: "0.10.27",
        language: "-",
        update: "-",
        edition: "-",
        targetPlatform: "-",
        vulnerabilities: 1,
        detailsLink: "#",
    },
]


export default function page() {
    const [data, setData] = useState([])
    const [sortField, setSortField] = useState("version")
    const [sortDirection, setSortDirection] = useState("desc")
    const [isLoading, setIsLoading] = useState(false);
    const [version, setVersion] = useState(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedLink = localStorage.getItem("version_link");
            setVersion(storedLink);
        }
    }, []);

    const fetchData = async (link) => {
        setIsLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/version?link=${link}`, {
                method: "GET",
            });
            const data = await res.json();
            setData(data.tableColumn);
        } catch (err) {
            toast.error(`Error while searching for version: ` + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // const handleClick = async (vuln) => {
    //     localStorage.setItem('cvv_link', vuln.href);
    //     localStorage.setItem('cvv_id', vuln.text);
    // }

    useEffect(() => {
        if (version) {
            fetchData(version);
        }
    }, [version]);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortField(field)
            setSortDirection("asc")
        }

        const sortedData = [...data].sort((a, b) => {
            if (sortDirection === "asc") {
                return a[field] > b[field] ? 1 : -1
            }
            return a[field] < b[field] ? 1 : -1
        })

        setData(sortedData)
    }

    const SortIcon = ({ field }) => {
        if (sortField !== field) return null
        return sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
    }


return (
    <div className="w-full bg-gradient-to-br from-gray-950 via-slate-900 to-zinc-900 min-h-screen p-6">
        {
            isLoading ? (
                <TableRow className="flex justify-center items-center border-b-0">
                    <TableCell colSpan={6} className="h-32 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                            <Loader2 className="h-8 w-8 animate-spin mb-2" />
                            <p>Searching for results...</p>
                        </div>
                    </TableCell>
                </TableRow>
            ) : (
                <div className="max-w-7xl mx-auto">
                    <div className="rounded-lg border border-gray-800 bg-black/40 backdrop-blur-sm overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-gray-800">
                                    <TableHead
                                        className="text-gray-400 font-medium cursor-pointer hover:text-white transition-colors"
                                        onClick={() => handleSort("version")}
                                    >
                                        <div className="flex items-center gap-2">
                                            Version
                                            <SortIcon field="version" />
                                        </div>
                                    </TableHead>
                                    <TableHead className="text-gray-400 font-medium">Language</TableHead>
                                    <TableHead className="text-gray-400 font-medium">Update</TableHead>
                                    <TableHead className="text-gray-400 font-medium">Edition</TableHead>
                                    <TableHead className="text-gray-400 font-medium">Target Platform</TableHead>
                                    <TableHead
                                        className="text-gray-400 font-medium cursor-pointer hover:text-white transition-colors text-right"
                                        onClick={() => handleSort("vulnerabilities")}
                                    >
                                        Vulnerabilities
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.map((row, index) => (
                                    <TableRow
                                        key={row[0]}
                                        className={`
                                            transition-colors border-gray-800
                                            ${index % 2 === 0 ? "bg-black/20" : "bg-black/40"}
                                            hover:bg-black/60
                                        `}
                                    >
                                        <TableCell className="font-mono text-blue-400">{row[0]}</TableCell>
                                        <TableCell className="text-gray-300">{row[1] === "" ? "-" : row[1]}</TableCell>
                                        <TableCell className="text-gray-300">{row[2] === "" ? "-" : row[2]}</TableCell>
                                        <TableCell className="text-gray-300">{row[3] === "" ? "-" : row[3]}</TableCell>
                                        <TableCell className="text-gray-300">{row[4] === "" ? "-" : row[4]}</TableCell>

                                        <TableCell className="text-right px-2 py-2">
                                            <Badge
                                                variant="outline"
                                                className={`
                                                    ml-auto inline-flex
                                                    ${row[5].txt > 2
                                                        ? "border-red-500 text-red-400"
                                                        : row[5].txt > 0
                                                            ? "border-yellow-500 text-yellow-400"
                                                            : "border-green-500 text-green-400"
                                                    }
                                                `}
                                            >
                                                <Link href={row[5].link} className="flex items-center gap-2">
                                                    {row[5].txt}
                                                </Link>
                                            </Badge>
                                        </TableCell>

                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            )
        }
    </div>
)


}


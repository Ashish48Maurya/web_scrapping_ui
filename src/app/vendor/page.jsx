"use client"

import { motion } from "framer-motion"
import { Shield, TrendingUp, AlertTriangle, BarChart3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"


export default function VulnerabilityTrendsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const vendor_link = localStorage.getItem('vendor_link');
  const [table1Row, setTable1Row] = useState([]);
  const [table2Row, setTable2Row] = useState([]);
  const [table1Col, setTable1Col] = useState([]);
  const [table2Col, setTable2Col] = useState([]);

  const fetchData = async (link) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/vendor?link=${link}`, {
        method: "GET",
      });
      const data = await res.json();
      console.log(data);
      setTable1Row(data.table1Row);
      setTable1Col(data.table1Column);
      setTable2Row(data.table2Row);
      setTable2Col(data.table2Column);
    } catch (err) {
      toast.error(`Error while searching for software: ` + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updatedTable1Col = table1Col.map((row, index) =>
    index === table1Col.length - 1 ? ["Total", ...row.slice(1)] : row
  );

  const vulnerabilityData = updatedTable1Col.map(row => {
    return table1Row.reduce((acc, key, index) => {
      let formattedKey = key
        .replace(/\s+/g, '')
        .replace(/[^a-zA-Z]/g, '') 
        .replace(/^./, str => str.toLowerCase()); 

      let value = row[index]?.trim(); 

      acc[formattedKey] = value !== "" && !isNaN(value) ? Number(value) : value;

      return acc;
    }, {});
  });

  const updatedTable2Col = table2Col.map((row, index) =>
    index === table2Col.length - 1 ? ["Total", ...row.slice(1)] : row
  );

  const impactData = updatedTable2Col.map(row => {
    return table2Row.reduce((acc, key, index) => {
      let formattedKey = key
        .replace(/\s+/g, '')
        .replace(/[^a-zA-Z]/g, '') 
        .replace(/^./, str => str.toLowerCase()); 

      let value = row[index]?.trim(); 

      acc[formattedKey] = value !== "" && !isNaN(value) ? Number(value) : value;

      return acc;
    }, {});
  });

  useEffect(() => {
    fetchData(vendor_link);
  }, [])


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-zinc-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
            <Shield className="h-16 w-16 mx-auto text-blue-400 mb-4" />
            <h1 className="text-4xl font-bold text-white mb-4">Vulnerability Statistics</h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Comprehensive overview of security vulnerabilities and their impact over time
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-black/40 border-blue-500/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <Tabs defaultValue="trends" className="space-y-6">
                <TabsList className="bg-black/40">
                  <TabsTrigger value="trends" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-500 text-white">
                    Vulnerability Trends
                  </TabsTrigger>
                  <TabsTrigger value="impact" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-500 text-white">
                    Impact Analysis
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="trends" className="overflow-auto">
                  <div className="inline-block min-w-full align-middle">
                    <table className="min-w-full divide-y divide-gray-800">
                      <thead>
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Year
                          </th>
                          {Object.keys(vulnerabilityData[0] || {})
                            .slice(1)
                            .map((key) => (
                              <th
                                key={key}
                                className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                              >
                                {key.replace(/([A-Z])/g, " $1").trim()}
                              </th>
                            ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                        {vulnerabilityData.map((row, idx) => (
                          <tr key={row.year} className="hover:bg-white/5 transition-colors">
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-400">
                              {row.year}
                            </td>
                            {Object.entries(row)
                              .slice(1)
                              .map(([key, value]) => (
                                <td key={key} className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                                  <div className="flex items-center justify-center w-8 h-8 rounded">
                                    <div
                                      className='w-full h-full rounded flex items-center justify-center'
                                    >
                                      {value}
                                    </div>
                                  </div>
                                </td>
                              ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>

                <TabsContent value="impact" className="overflow-auto">
                  <div className="inline-block min-w-full align-middle">
                    <table className="min-w-full divide-y divide-gray-800">
                      <thead>
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Year
                          </th>
                          {Object.keys(impactData[0] || {})
                            .slice(1)
                            .map((key) => (
                              <th
                                key={key}
                                className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                              >
                                {key.replace(/([A-Z])/g, " $1").trim()}
                              </th>
                            ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                        {impactData.map((row, idx) => (
                          <tr key={row.year} className="hover:bg-white/5 transition-colors">
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-400">
                              {row.year}
                            </td>
                            {Object.entries(row)
                              .slice(1)
                              .map(([key, value]) => (
                                <td key={key} className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                                  <div className="flex items-center justify-center w-8 h-8 rounded">
                                    <div
                                      className='w-full h-full rounded flex items-center justify-center'
                                    >
                                      {value}
                                    </div>
                                  </div>
                                </td>
                              ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}


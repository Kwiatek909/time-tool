import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Copy, Calculator, Clock } from 'lucide-react';

const TimeCalculator = () => {
  const [time1, setTime1] = useState('');
  const [time2, setTime2] = useState('');
  const [result, setResult] = useState('');
  const { toast } = useToast();

  const parseTime = (timeStr: string): number | null => {
    try {
      const parts = timeStr.split('.');
      if (parts.length !== 3) return null;
      
      const minutes = parseInt(parts[0]);
      const seconds = parseInt(parts[1]);
      const milliseconds = parseInt(parts[2]);
      
      if (isNaN(minutes) || isNaN(seconds) || isNaN(milliseconds)) return null;
      
      const totalMs = (minutes * 60 * 1000) + (seconds * 1000) + milliseconds;
      return totalMs;
    } catch {
      return null;
    }
  };

  const formatTime = (totalMs: number): string => {
    const minutes = Math.floor(totalMs / (60 * 1000));
    const remainingMs = totalMs % (60 * 1000);
    const seconds = Math.floor(remainingMs / 1000);
    const milliseconds = remainingMs % 1000;
    return `${minutes}.${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
  };

  const calculate = () => {
    const ms1 = parseTime(time1);
    const ms2 = parseTime(time2);

    if (ms1 === null || ms2 === null) {
      toast({
        title: "Błąd",
        description: "Niepoprawny format czasu. Użyj formatu mm.ss.mmm",
        variant: "destructive"
      });
      return;
    }

    const sum = ms1 + ms2;
    const formattedResult = formatTime(sum);
    setResult(formattedResult);
  };

  const copyResult = async () => {
    if (result) {
      try {
        await navigator.clipboard.writeText(result);
        toast({
          title: "Skopiowano!",
          description: "Wynik został skopiowany do schowka"
        });
      } catch {
        toast({
          title: "Błąd",
          description: "Nie udało się skopiować wyniku",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="p-2 rounded-full bg-primary/10">
              <Clock className="w-6 h-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Kalkulator Czasu
          </CardTitle>
          <p className="text-sm text-muted-foreground">Dodaj dwa czasy w formacie mm.ss.mmm</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="time1" className="text-sm font-medium">
                Czas 1 (mm.ss.mmm)
              </Label>
              <Input
                id="time1"
                value={time1}
                onChange={(e) => setTime1(e.target.value)}
                placeholder="0.00.000"
                className="text-center font-mono text-lg h-12 border-2 focus:border-primary/50 transition-colors"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time2" className="text-sm font-medium">
                Czas 2 (mm.ss.mmm)
              </Label>
              <Input
                id="time2"
                value={time2}
                onChange={(e) => setTime2(e.target.value)}
                placeholder="0.00.000"
                className="text-center font-mono text-lg h-12 border-2 focus:border-primary/50 transition-colors"
              />
            </div>
          </div>

          <Button 
            onClick={calculate}
            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Calculator className="w-5 h-5 mr-2" />
            Oblicz
          </Button>

          {result && (
            <div className="space-y-3 p-4 bg-secondary/20 rounded-lg border-2 border-secondary/30">
              <Label className="text-sm font-medium text-muted-foreground">Wynik:</Label>
              <div className="text-center">
                <div className="text-2xl font-bold font-mono text-primary bg-primary/5 py-3 px-4 rounded-lg border border-primary/20">
                  {result}
                </div>
              </div>
              <Button
                onClick={copyResult}
                variant="outline"
                className="w-full mt-2 border-primary/20 hover:bg-primary/5 hover:border-primary/40 transition-colors"
              >
                <Copy className="w-4 h-4 mr-2" />
                Kopiuj wynik
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeCalculator;
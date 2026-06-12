#!/usr/bin/perl
# Convertit les traits d'union de PLAGE en tiret demi-cadratin « – » (U+2013).
# Ne touche QU'une plage chiffre-chiffre suivie d'une vraie unité (fr/en/de) ou de « % ».
# → exclut dates (2026-06-12), hachages, IDs, vrais traits d'union.
# Usage : perl fix-range-dashes.pl [--write] fichier1 fichier2 ...
use strict;
use warnings;
use utf8;
binmode(STDOUT, ':encoding(UTF-8)');

my $write = 0;
my @files;
for my $a (@ARGV) { if ($a eq '--write') { $write = 1 } else { push @files, $a } }

# Unités reconnues (mot complet via \b). « % » traité à part (pas de \b après).
my $UNITS = qr/(?:minutes?|minuten|min|secondes?|seconds?|sekunden|secs?|sek|heures?|hours?|stunden|jours?|days?|tagen?|werktagen|semaines?|weeks?|wochen?|woche|mois|months?|monate|r[eé]p[eé]titions|reps?|rounds?|runden|wdh|calories?|kalorien|lbs|kg|mg|ml|km|cm|mm|g|h)\b/i;
# Plage : 1 à 3 chiffres - 1 à 3 chiffres, non précédée d'un chiffre/.,- (anti-date/décimal),
# suivie (opt. espace) d'une unité whitelistée ou de %.
my $RE = qr/(?<![\d.,-])(\d{1,3})-(\d{1,3})(?=\s?(?:$UNITS|%))/;

my $total = 0;
for my $f (@files) {
  open(my $fh, '<:encoding(UTF-8)', $f) or do { warn "skip $f: $!\n"; next };
  my @lines = <$fh>; close $fh;
  my $changed = 0;
  for my $i (0..$#lines) {
    my $orig = $lines[$i];
    (my $new = $orig) =~ s/$RE/$1\x{2013}$2/g;
    if ($new ne $orig) {
      $changed++; $total++;
      # rapport : montre les segments modifiés
      my @olds = ($orig =~ /$RE/g);
      print "$f:" . ($i+1) . "\n";
      # extrait court autour de chaque remplacement
      my $o = $orig; my $n = $new;
      $o =~ s/^\s+//; $n =~ s/^\s+//;
      chomp($o); chomp($n);
      $o = substr($o,0,160); $n = substr($n,0,160);
      print "   - $o\n   + $n\n";
      $lines[$i] = $new;
    }
  }
  if ($write && $changed) {
    open(my $out, '>:encoding(UTF-8)', $f) or do { warn "write $f: $!\n"; next };
    print $out @lines; close $out;
  }
}
print "\n== " . ($write ? "ÉCRIT" : "DRY-RUN") . " : $total ligne(s) avec plage(s) corrigée(s) ==\n";

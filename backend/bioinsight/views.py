from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import DNAInputSerializer
from Bio import pairwise2
from Bio.pairwise2 import format_alignment

class DNAAlignmentView(APIView):
    def post(self, request):
        # Validate incoming data
        serializer = DNAInputSerializer(data=request.data)
        if serializer.is_valid():
            seq1 = serializer.validated_data['sequence1']
            seq2 = serializer.validated_data['sequence2']

            # Perform sequence alignment (global alignment with match=2, mismatch=-1)
            alignments = pairwise2.align.globalmx(seq1, seq2, match=2, mismatch=-1)

            # Separate alignments and scores
            alignment_list = []
            score_list = []

            for alignment in alignments:
                # Extract and format alignment
                formatted_alignment = format_alignment(*alignment).strip().split("\n")
                alignment_list.append({
                    "sequence1": formatted_alignment[0],
                    "alignment": formatted_alignment[1],  # This is the line showing matches/mismatches
                    "sequence2": formatted_alignment[2]
                })
                score_list.append(alignment.score)

            return Response({
                "alignments": alignment_list,
                "scores": score_list
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
